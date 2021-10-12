export interface Round {
  _id: string;
  kills: string[];
  playerHurts: string[];
  bombStatusChanges: string[];
  playerBlinds: string[];
  grenades: string[];
  chickenDeaths: any[];
  startTick: number;
  endTick: number;
  endReason: number;
  winningTeam: string;
  type: string;
  officialEndTick: number;
  __v: number;
  winningSide: string;
}

export interface Team {
  _id: string;
  players: string[];
  name: string;
  handle: number;
  startingSide: string;
  __v: number;
}

export interface Match {
  _id: string;
  rounds: Round[];
  teams: Team[];
  durationTicks: number;
  map: string;
  tickrate: number;
  date: Date;
  __v: number;
}

export interface RootObject {
  match: Match;
}
