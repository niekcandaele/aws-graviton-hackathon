export interface Position {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Attacker {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  weapon: string;
  bulletsInMagazine: number;
  position: Position;
  placeName: string;
  __v: number;
  player: string;
}

export interface Position2 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Victim {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  position: Position2;
  placeName: string;
  __v: number;
  player: string;
  weapon: string;
  bulletsInMagazine?: number;
}

export interface Kill {
  _id: string;
  tick: number;
  throughSmoke: boolean;
  throughWall: boolean;
  whileBlind: boolean;
  attacker: Attacker;
  victim: Victim;
  __v: number;
  assister: string;
}

export interface Position3 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Player {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  weapon: string;
  bulletsInMagazine: number;
  position: Position3;
  placeName: string;
  __v: number;
}

export interface Position4 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface BombStatusChange {
  _id: string;
  status: string;
  tick: number;
  player: Player;
  position: Position4;
  placeName: string;
  __v: number;
}

export interface Position5 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Attacker2 {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  weapon: string;
  bulletsInMagazine: number;
  position: Position5;
  placeName: string;
  __v: number;
  player: string;
}

export interface Position6 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Victim2 {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  weapon: string;
  bulletsInMagazine: number;
  position: Position6;
  placeName: string;
  __v: number;
  player: string;
}

export interface PlayerBlind {
  _id: string;
  tick: number;
  attacker: Attacker2;
  victim: Victim2;
  duration: number;
  __v: number;
}

export interface Position7 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Attacker3 {
  _id: string;
  tick: number;
  equipmentValue: number;
  freezeTimeEndEquipmentValue: number;
  cashSpentInRound: number;
  hasC4: boolean;
  health: number;
  armour: number;
  isScoped: boolean;
  weapon: string;
  bulletsInMagazine: number;
  position: Position7;
  placeName: string;
  __v: number;
  player: string;
}

export interface Position8 {
  x: number;
  y: number;
  z: number;
  _id: string;
}

export interface Grenade {
  _id: string;
  tick: number;
  attacker: Attacker3;
  type: string;
  position: Position8;
  __v: number;
}

export interface Round {
  _id: string;
  kills: Kill[];
  playerHurts: string[];
  bombStatusChanges: BombStatusChange[];
  playerBlinds: PlayerBlind[];
  grenades: Grenade[];
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

export interface Player2 {
  _id: string;
  steamId: string;
  __v: number;
  name?: string
}

export interface Team {
  _id: string;
  players: Player2[];
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

