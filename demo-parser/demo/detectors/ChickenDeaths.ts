import { DemoFile, IEventFlashbangDetonate, IEventHegrenadeDetonate } from 'demofile';

import { ChickenDeath } from '../../models/ChickenDeath';
import { Grenade } from '../../models/Grenade';
import { IMatch } from '../../models/Match';
import createPlayerInfo from '../createPlayerInfo';
import { GrenadeType } from '../type/GrenadeType';
import Detector from './Detector';


export default class Chicken extends Detector {
  savePriority = 7600;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'ChickenDeath';
  }

  async calculate(): Promise<void> {
    this.demoFile.gameEvents.on('other_death', async (e) => {
      // This event also fires when doors, windows, ... break
      // But we are only interested in 🐔 CHIKIN 🐔
      if (e.othertype !== 'chicken') {
        return;
      }

      const attacker = this.getPlayerFromId(e.attacker);

      if (!attacker) {
        return;
      }

      //console.log(this.demoFile.entities.entities.get(e.attacker));
      //console.log(this.demoFile.entities.entities.get(e.otherid));

      this.logger.debug(`${attacker.name} killed a ${e.othertype} at ${attacker.position.x} ${attacker.position.y} ${attacker.position.z}`);

      const chickenDeathRecord = new ChickenDeath();

      chickenDeathRecord.tick = this.currentTick;
      chickenDeathRecord.throughSmoke = e.thrusmoke;
      chickenDeathRecord.throughWall = !!e.penetrated;
      chickenDeathRecord.whileBlind = e.attackerblind;

      chickenDeathRecord.attacker = await createPlayerInfo(this.demoFile, attacker);
      chickenDeathRecord.attacker.player = this.findMatchingPlayer(attacker);

      this.currentRound.chickenDeaths.push(chickenDeathRecord);

    })
  }

  async saveData() {
    for (const round of this.match.rounds) {
      for (const chickenDeath of round.chickenDeaths) {
        await chickenDeath.attacker.save();
        await chickenDeath.save();
      }
    }
  }

}
