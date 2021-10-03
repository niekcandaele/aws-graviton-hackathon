import { DemoFile } from 'demofile';

import { animalNames } from '../../lib/animals';
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
        player.name = this.getAnonymizedName(player, this.playersInMatch);
      }
      await player.save();
      this.playersInMatch.push(player);
      return player;
    }
  }

  // Assign all players a random animal name
  // This is prettier to display in the frontend + privacy + this way there wont be any "xX_iLuVM1LFs_420_Xx"s in the database :))
  private getAnonymizedName(player: IPlayer, playersInMatch: IPlayer[]) {
    const existingNamesInMatch = playersInMatch.map(p => p.name);
    const possibleNames = animalNames.filter(
      name => existingNamesInMatch.indexOf(name) === -1
    );

    return possibleNames[Math.floor(Math.random() * possibleNames.length)];
  }
}
