import { DemoFile } from 'demofile';

import { IMatch } from '../../models/Match';
import { PlayerHurt } from '../../models/PlayerHurt';
import createPlayerInfo from '../createPlayerInfo';
import { HitGroupMapper } from '../type/HitGroup';
import Detector from './Detector';

export default class Hurt extends Detector {
  savePriority = 6000;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'Player hurt';
  }

  async calculate(): Promise<void> {

      this.demoFile.gameEvents.on('player_hurt', async (e) => {
        // The event happened outside of an official round
        // Could be a warmup round or other pre-game stuff
        if (!this.currentRound) {
          return;
        }


        const attacker = this.getPlayerFromId(e.attacker);
        const victim = this.getPlayerFromId(e.userid);
        const hitGroup = HitGroupMapper[e.hitgroup];
        const weapon = e.weapon

        if (!victim || !attacker) {
          return;
        }

        this.logger.debug(
          `${attacker.name} (${attacker.steam64Id}) hurt ${victim.name} (${victim.steam64Id}) on tick ${this.demoFile.currentTick} for ${e.dmg_health} health and ${e.dmg_armor} armour with ${weapon} at ${hitGroup}`
        )

        const hurtRecord = new PlayerHurt();

        hurtRecord.tick = this.currentTick;
  
        hurtRecord.attacker = await createPlayerInfo(this.demoFile, attacker, 'hurt_attacker');
        hurtRecord.attacker.player = this.findMatchingPlayer(attacker);
        hurtRecord.victim = await createPlayerInfo(this.demoFile, victim, 'hurt_victim');
        hurtRecord.victim.player = this.findMatchingPlayer(victim);
        hurtRecord.hitGroup = hitGroup;
        hurtRecord.weapon = weapon;
        hurtRecord.healthDmg = e.dmg_health;
        hurtRecord.armourDmg = e.dmg_armor;

        this.currentRound.playerHurts.push(hurtRecord);
      });

  }

  async saveData() {
    for (const round of this.match.rounds) {
      for (const hurt of round.playerHurts) {
        await hurt.attacker.save();
        await hurt.victim.save();
        await hurt.save();
      }
    }
  }
}
