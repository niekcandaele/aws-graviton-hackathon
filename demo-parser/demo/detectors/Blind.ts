import { DemoFile, IEventFlashbangDetonate, IEventHegrenadeDetonate } from 'demofile';

import { Grenade } from '../../models/Grenade';
import { IMatch } from '../../models/Match';
import { PlayerBlind } from '../../models/PlayerBlind';
import createPlayerInfo from '../createPlayerInfo';
import { GrenadeType } from '../type/GrenadeType';
import Detector from './Detector';

export default class Blind extends Detector {
  savePriority = 7500;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'Blind';
  }

  async calculate(): Promise<void> {
    this.demoFile.gameEvents.on('player_blind', async (e) => {
      const attacker = this.getPlayerFromId(e.attacker);
      const victim = this.getPlayerFromId(e.userid);
      const duration = e.blind_duration;

      if (!victim || !attacker) {
        return;
      }

      this.logger.debug(
        `${attacker.name} (${attacker.steam64Id}) blinded ${victim.name} (${victim.steam64Id}) on tick ${this.demoFile.currentTick} for duration ${duration}`
      )

      const blindRecord = new PlayerBlind();

      blindRecord.tick = this.currentTick;
      blindRecord.attacker = await createPlayerInfo(this.demoFile, attacker, 'player_blind');
      blindRecord.attacker.player = this.findMatchingPlayer(attacker);
      blindRecord.victim = await createPlayerInfo(this.demoFile, victim, 'player_blind');
      blindRecord.victim.player = this.findMatchingPlayer(victim);
      blindRecord.duration = duration;

      this.currentRound.playerBlinds.push(blindRecord);

    })

  }

  async saveData() {
    for (const round of this.match.rounds) {
      for (const blind of round.playerBlinds) {
        await blind.attacker.save();
        await blind.victim.save();
        await blind.save();
      }
    }
  }

}
