import { DemoFile, IEventFlashbangDetonate, IEventHegrenadeDetonate } from 'demofile';

import { ChickenDeath } from '../../models/ChickenDeath';
import { Grenade } from '../../models/Grenade';
import { IMatch } from '../../models/Match';
import { IPlayerInfo } from '../../models/PlayerInfo';
import createPlayerInfo from '../createPlayerInfo';
import { GrenadeType } from '../type/GrenadeType';
import Detector from './Detector';


export default class PlayerInterval extends Detector {
  savePriority = 7700;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  private playerIntervalSnapshots: Promise<IPlayerInfo>[] = [];

  getName() {
    return 'PlayerInterval';
  }

  async calculate(): Promise<void> {
    let tick = 0;

    this.demoFile.on('tickend', async t => {
      tick++;

      if (tick >= this.demoFile.tickRate * 3) {
        tick = 0;
        this.logger.debug(`Making snapshot of all player infos ${this.demoFile.currentTick}`)
        for (const player of this.demoFile.players) {
          if (player.isAlive) {
            this.playerIntervalSnapshots.push(createPlayerInfo(this.demoFile, player, 'interval'))
          }
        }
      }
    })

    this.demoFile.gameEvents.on('round_freeze_end', e => {
      for (const player of this.demoFile.players) {
        if (player.isAlive) {
          this.playerIntervalSnapshots.push(createPlayerInfo(this.demoFile, player, 'freezetime_end'))
        }
      }
    });

  }

  async saveData() {
    await Promise.all(this.playerIntervalSnapshots);
  }

}
