import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPlayerInfo } from './PlayerInfo';
import { IPosition, PositionSchema } from './Position';
import { GrenadeType } from './type/GrenadeType';
import { HitGroupMapper } from './type/HitGroup';

export interface IGrenade extends Document {
  tick: Number
  attacker: IPlayerInfo,
  type: GrenadeType,
  position: IPosition,

}

export const GrenadeSchema = new Schema<IGrenade>({
  tick: Number,
  attacker: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  type: {type: String, enum: [...Object.values(GrenadeType), null]},
  position: PositionSchema,
})

export const Grenade = mongoose.model<IGrenade>('Grenade', GrenadeSchema);

