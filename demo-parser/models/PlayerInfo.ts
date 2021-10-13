import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { WeaponEnum } from '../demo/type/WeaponEnum';
import { IPlayer } from './Player';
import { IPosition, PositionSchema } from './Position';



export interface IPlayerInfo extends Document {
  tick: Number,
  equipmentValue: Number,
  freezeTimeEndEquipmentValue: Number,
  cashSpentInRound: Number,
  hasC4: Boolean,
  health: Number,
  armour: Number,
  isScoped: Boolean,
  weapon: String,
  bulletsInMagazine: Number,
  position: IPosition,
  player: IPlayer | undefined
  placeName: string,
  type: string
  round: string
}

export const PlayerInfoSchema = new Schema({
  tick: Number,
  equipmentValue: Number,
  freezeTimeEndEquipmentValue: Number,
  cashSpentInRound: Number,
  hasC4: Boolean,
  health: Number,
  armour: Number,
  isScoped: Boolean,
  weapon: String,
  bulletsInMagazine: Number,
  position: PositionSchema,
  player: {type: Schema.Types.ObjectId, ref: 'Player'},
  placeName: String,
  type: String,
  round: {type: Schema.Types.ObjectId, ref: 'Round'}
})



export const PlayerInfo = mongoose.model('PlayerInfo', PlayerInfoSchema);