import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { HitGroupMapper } from '../demo/type/HitGroup';
import { IPlayerInfo } from './PlayerInfo';

export interface IPlayerHurt extends Document {
  tick: Number
  attacker: IPlayerInfo,
  victim: IPlayerInfo,
  healthDmg: Number,
  armourDmg: Number,
  hitGroup: string,
  weapon: string
}

export const PlayerHurtSchema = new Schema<IPlayerHurt>({
  tick: Number,
  attacker: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  victim: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  healthDmg: Number,
  armourDmg: Number,
  hitGroup: {type: String, enum: Object.values(HitGroupMapper)},
  weapon: String

})

export const PlayerHurt = mongoose.model<IPlayerHurt>('PlayerHurt', PlayerHurtSchema);

