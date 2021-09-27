import { DemoFile } from 'demofile';

import { IMatch } from '../../models/Match';
import { IPlayer, Player } from '../../models/Player';
import Detector from './Detector';

export default class Players extends Detector {
  constructor(demoFile: DemoFile, match: IMatch) {
    super(demoFile, match);
  }
  savePriority = 1000;
  private steamIdsInMatch: string[] = [];
  private playersInMatch: Array<IPlayer> = [];

  getName() {
    return 'Players';
  }

  async calculate(): Promise<void> {
    this.match.players = [];
    this.demoFile.gameEvents.on('round_start', async () => {
      const players = this.demoFile.players;

      for (const demoPlayer of players) {
        const demoPlayerSteamId = demoPlayer.steam64Id.toString();
        await this.createPlayer(demoPlayerSteamId);
        this.match.players = this.playersInMatch;
      }
    });
  }

  async saveData() {
    await Promise.all(this.playersInMatch.map(_ => _.save()));
  }

  async createPlayer(steamId: string) {
    const existsInCurrentMatch =
      this.steamIdsInMatch.indexOf(steamId) === -1 ? false : true;
    const isSteamId = /[0-9]{17}/.test(steamId);

    if (!existsInCurrentMatch && isSteamId) {
      this.steamIdsInMatch.push(steamId);
      const existingRecord = await Player.findOne({steamId})
      
      let player: IPlayer;

      if (existingRecord) {
        player = existingRecord;
      } else {
        player = new Player();
        player.steamId = steamId;
      }
      await player.save();
      this.playersInMatch.push(player);
      return player;
    }
  }
}
