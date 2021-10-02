import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPlayer } from './Player';
import { IPosition, PositionSchema } from './Position';
import { WeaponEnum } from './type/WeaponEnum';

export interface IPlayerInfo extends Document {
  tick: Number,
  equipmentValue: Number,
  freezeTimeEndEquipmentValue: Number,
  cashSpentInRound: Number,
  hasC4: Boolean,
  health: Number,
  armour: Number,
  isScoped: Boolean,
  weapon: WeaponEnum,
  bulletsInMagazine: Number,
  position: IPosition,
  player: IPlayer | undefined
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
  weapon: {type: String, enum: [...Object.values(WeaponEnum), null]},
  bulletsInMagazine: Number,
  position: PositionSchema,
  player: {type: Schema.Types.ObjectId, ref: 'Player'},
})



export const PlayerInfo = mongoose.model('PlayerInfo', PlayerInfoSchema);