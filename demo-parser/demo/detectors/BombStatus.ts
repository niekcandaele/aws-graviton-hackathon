import { DemoFile, Player } from 'demofile';

import { BombStatusChange } from '../../models/BombStatusChange';
import { IMatch } from '../../models/Match';
import { IPosition } from '../../models/Position';
import createPlayerInfo from '../createPlayerInfo';
import { BombStatusChangeEnum } from '../type/BombStatusChange';
import Detector from './Detector';

export default class BombStatus extends Detector {
  savePriority = 2400;
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }

  getName() {
    return 'Bomb status changes';
  }

  private createBombPosition(type: BombStatusChangeEnum, player: Player | null) {
    const position: IPosition = { x: 0, y: 0, z: 0 };
    let x, y, z;
    if (this.bomb !== undefined) {
      ({ x, y, z } = this.bomb.position);
    }

    // If the bomb exploded, there is no entity anymore to get the position of
    // We find the postion of the bombPlanted event and use that instead
    if (type === BombStatusChangeEnum.Exploded) {
      this.logger.debug(
        'No bomb entity found, finding location where bomb was planted'
      );

      const bombPlantedEvent = this.currentRound.bombStatusChanges.find(_ => _.status === BombStatusChangeEnum.Planted);
    
      if (bombPlantedEvent) {
        ({ x, y, z } = bombPlantedEvent.position);
      }
    }

    if (player) {
      // If the bomb was picked up
      // We should use the players position
      if (type === BombStatusChangeEnum.PickedUp) {
        ({ x, y, z } = player.position);
      }

      // If position is 0 for whatever reason
      // We use the players position
      if (
        parseInt(x, 10) === 0 &&
        parseInt(y, 10) === 0 &&
        parseInt(z, 10) === 0
      ) {
        ({ x, y, z } = player.position);
      }

      // If position is undefined/null for whatever reason
      // We use the players position
      if (!x && !y && !z) {
        ({ x, y, z } = player.position);
      }
    }


    position.x = x.toString();
    position.y = y.toString();
    position.z = z.toString();
    return position;
  }

  private async createBombStatus(type: BombStatusChangeEnum, player: Player | null) {
    const bombStatus = new BombStatusChange();
    bombStatus.status = type;
    bombStatus.tick = this.currentTick;
    if (player) {
      bombStatus.player = await createPlayerInfo(this.demoFile, player);
      bombStatus.placeName = player.placeName;
    }

    bombStatus.position = this.createBombPosition(type, player);
    this.currentRound.bombStatusChanges.push(bombStatus);
  }

  async calculate() {
    this.demoFile.gameEvents.on('bomb_defused', e => {
      this.logger.debug(`Bomb defused ${e.site}`);
      this.createBombStatus(
        BombStatusChangeEnum.Defused,
        this.getPlayerFromId(e.userid)
      );
    });

    this.demoFile.gameEvents.on('bomb_exploded', e => {
      this.logger.debug(`Bomb exploded ${e.site}`);
      this.createBombStatus(
        BombStatusChangeEnum.Exploded,
        this.getPlayerFromId(e.userid)
      );
    });

    // @ts-expect-error types of lib dont match up :))
    this.demoFile.gameEvents.on('bomb_abortdefuse', e => {
      this.logger.debug(`Bomb stopped defusing`);
      this.createBombStatus(
        BombStatusChangeEnum.StopDefuse,
        this.getPlayerFromId(e.userid)
      );
    });

    this.demoFile.gameEvents.on('bomb_begindefuse', e => {
      this.logger.debug(`Bomb started defusing`);
      this.createBombStatus(
        BombStatusChangeEnum.StartDefuse,
        this.getPlayerFromId(e.userid)
      );
    });

    this.demoFile.gameEvents.on('bomb_dropped', e => {
      this.logger.debug(`Bomb dropped`);
      this.createBombStatus(
        BombStatusChangeEnum.Dropped,
        this.getPlayerFromId(e.userid)
      );
    });

    this.demoFile.gameEvents.on('bomb_pickup', e => {
      this.logger.debug(`Bomb picked up`);
      this.createBombStatus(
        BombStatusChangeEnum.PickedUp,
        this.getPlayerFromId(e.userid)
      );
    });

    this.demoFile.gameEvents.on('bomb_planted', e => {
      this.logger.debug(`Bomb planted`);
      this.createBombStatus(
        BombStatusChangeEnum.Planted,
        this.getPlayerFromId(e.userid)
      );
    });
  }

  async saveData() {
    for (const round of this.match.rounds) {
      for (const statusChange of round.bombStatusChanges) {
        if (statusChange.player) {
          await statusChange.player.save();
        }

        await statusChange.save();
      }
    }
  }
}
