import { DemoFile, IEventFlashbangDetonate, IEventHegrenadeDetonate } from 'demofile';

import { Grenade } from '../../models/Grenade';
import { IMatch } from '../../models/Match';
import createPlayerInfo from '../createPlayerInfo';
import { GrenadeType } from '../type/GrenadeType';
import Detector from './Detector';

export default class Grenades extends Detector {
  savePriority = 7000;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'Grenades';
  }

  async calculate(): Promise<void> {
      this.demoFile.gameEvents.on('flashbang_detonate', this.handleGrenade(GrenadeType.FLASHBANG));
      this.demoFile.gameEvents.on('hegrenade_detonate', this.handleGrenade(GrenadeType.HE));
      this.demoFile.gameEvents.on('decoy_detonate', this.handleGrenade(GrenadeType.DECOY));
      this.demoFile.gameEvents.on('smokegrenade_detonate', this.handleGrenade(GrenadeType.SMOKE));
  }

  async saveData() {
    for (const round of this.match.rounds) {
      for (const hurt of round.grenades) {
        await hurt.attacker.save();
        await hurt.save();
      }
    }
  }


  private handleGrenade(type: GrenadeType) {
    return async (e: IEventHegrenadeDetonate | IEventFlashbangDetonate) => {
      const attacker = this.getPlayerFromId(e.userid);
      const position = {
        x: e.x,
        y: e.y,
        z: e.z,
      }

      if (!attacker) {
        return;
      }

      this.logger.debug(`${attacker.name} detonated a ${type} at ${position.x} ${position.y} ${position.z}`);

      const grenadeRecord = new Grenade();

      grenadeRecord.attacker = await createPlayerInfo(this.demoFile, attacker);
      grenadeRecord.attacker.player = this.findMatchingPlayer(attacker);
      
      grenadeRecord.position = position;
      grenadeRecord.type = type;
      grenadeRecord.tick = this.currentTick;

      this.currentRound.grenades.push(grenadeRecord);
    }
  }
}
