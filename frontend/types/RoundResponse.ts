export interface Position {
    x: number;
    y: number;
    z: number;
    _id: string;
}

export interface Player {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
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
    type: string;
    __v: number;
    player: Player;
}

export interface Position2 {
    x: number;
    y: number;
    z: number;
    _id: string;
}

export interface Player2 {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
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
    weapon: string;
    bulletsInMagazine: number;
    position: Position2;
    placeName: string;
    type: string;
    __v: number;
    player: Player2;
}

export interface Prediction {
    certainty: number;
    team_id: string;
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
    prediction: Prediction;
    assister: string;
}

export interface Position3 {
    x: number;
    y: number;
    z: number;
    _id: string;
}

export interface Player4 {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
}

export interface Player3 {
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
    type: string;
    __v: number;
    player: Player4;
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
    player: Player3;
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

export interface Player5 {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
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
    type: string;
    __v: number;
    player: Player5;
}

export interface Position6 {
    x: number;
    y: number;
    z: number;
    _id: string;
}

export interface Player6 {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
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
    type: string;
    __v: number;
    player: Player6;
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

export interface Player7 {
    _id: string;
    steamId: string;
    name: string;
    __v: number;
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
    type: string;
    __v: number;
    player: Player7;
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
    officialEndTick: number;
    type: string;
    __v: number;
}
