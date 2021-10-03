import { DemoFile, Team as DemoTeam } from 'demofile';

import { IMatch } from '../../models/Match';
import { IRound, Round } from '../../models/Round';
import { ITeam } from '../../models/Team';
import { RoundType } from '../type/RoundTypeEnum';
import { TeamType } from '../type/TeamType';
import { WeaponEnum } from '../type/WeaponEnum';
import Detector from './Detector';

export default class Rounds extends Detector {
  private activeRound!: IRound;
  private activeRoundWinner!: DemoTeam | undefined

  // At halftime, teams switch. This variable is used to keep track of that
  private invertTeams = false;
  savePriority = 3000;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'Rounds';
  }

  private isKnifeRound(round: IRound) {
    return round.kills.every(_ => {
      if (_.attacker) {
        return _.attacker.weapon === "weapon_knife" || _.attacker.weapon === "weapon_bayonet";
      } else {
        // If there was no attacker, we still assume knife round
        // E.g someone can yeet themselves off the map in Vertigo during knife round
        return true;
      }
    });
  }

  getActiveRound() {
    return this.match.rounds[this.match.rounds.length - 1];
  }

  async calculate(): Promise<void> {
    this.match.rounds = [];
    this.demoFile.gameEvents.on('round_start', () => {
      this.logger.debug(`Round ${this.match.rounds.length + 1} started`);
      this.activeRound = new Round();
      this.activeRound.kills = [];
      this.activeRound.playerHurts = [];
      this.activeRound.grenades = [];
      this.activeRound.bombStatusChanges = [];
      this.activeRound.startTick = this.demoFile.currentTick;
      this.match.rounds.push(this.activeRound);
    });

    this.demoFile.gameEvents.on('round_end', e => {
      this.activeRound = this.getActiveRound();
      if (!this.activeRound) {
        return;
      }
      this.logger.debug(`Round ${this.match.rounds.length} ended`);
      this.activeRound.endTick = this.demoFile.currentTick;

      this.activeRound.endReason = e.reason;
      this.activeRoundWinner = this.demoFile.teams.find(_ => {
        return _.teamNumber === e.winner;
      });
      this.activeRound.winningTeam = this.findMatchingTeam(
        this.activeRoundWinner,
        this.match.teams
      );

      if (this.activeRound.winningTeam) {
        if (!this.invertTeams) {
          this.activeRound.winningSide = this.activeRound.winningTeam.startingSide
        } else {
          if (this.activeRound.winningTeam.startingSide === TeamType.CounterTerrorist) {
            this.activeRound.winningSide = TeamType.Terrorist
          } else {
            this.activeRound.winningSide = TeamType.CounterTerrorist
          }
        }
      }


    });

    this.demoFile.gameEvents.on('round_officially_ended', () => {
      this.activeRound = this.getActiveRound();
      if (!this.activeRound) {
        return;
      }
      this.logger.debug(`Round ${this.match.rounds.length} officially ended`);

      this.activeRound.officialEndTick = this.demoFile.currentTick;
    });

    this.demoFile.gameEvents.on('round_announce_last_round_half', () => {
      this.logger.debug(`Half time! Switching teams`);
      this.invertTeams = !this.invertTeams;
    });
  }

  async saveData() {
    // If there are no kills made in the round
    // This is a 'inbetween' round used to set configs, do a mapvote, ...
    // We should not keep track of these
    this.match.rounds = this.match.rounds.filter(_ => _.kills.length);

    this.match.rounds = this.match.rounds.map((_, i) => {
      if (this.isKnifeRound(_)) {
        this.logger.debug(
          `Detected a knife round on round #${i} with ${_.kills.length} kills`
        );
        _.type = RoundType.Knife;
      } else {
        _.type = RoundType.Normal;
      }
      return _;
    });

    for (const round of this.match.rounds) {
      // If a round has no endTick, it never actually ended
      // and we should not try to save it
      if (!round.endTick) {
        continue;
      }

      // Sometimes a round has no officialEndTick
      // In that case, we set it to endTick
      if (!round.officialEndTick) {
        round.officialEndTick = round.endTick;
      }

      try {
        await round.save();
      } catch (e) {
        // TODO:
        // Demos have weird behavior, like rounds starting but not 'ending'.
        // If a round fails to save, we assume the round is bogus
        // For now, just log any errors that happen and capture them in Sentry
        // This way we will be able to see what demo types show which weird behavior
        this.logger.error(e);
      }
    }
  }

  private findMatchingTeam(demoTeam: DemoTeam | undefined, matchTeams: ITeam[]) {
    if (!demoTeam) {
      return undefined;
    }

    if (this.invertTeams) {
      return matchTeams.find(team => team.handle !== demoTeam.handle);
    } else {
      return matchTeams.find(team => team.handle === demoTeam.handle);
    }
  }
}
