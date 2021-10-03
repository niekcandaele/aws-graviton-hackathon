import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { BombStatusChangeEnum as BombStatusChangeEnum } from '../demo/type/BombStatusChange';
import { IPlayerInfo } from './PlayerInfo';
import { IPlayerKill } from './PlayerKill';
import { autoPopulateAllFields } from './populateHook';
import { IPosition, PositionSchema } from './Position';

export interface IBombStatusChange extends Document {
  tick: Number
  status: BombStatusChangeEnum
  player: IPlayerInfo
  position: IPosition,
  placeName: string
}

export const BombStatusChangeSchema = new Schema<IBombStatusChange>({
  status: {type: String, enum: Object.values(BombStatusChangeEnum)},
  tick: Number,
  player: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  position: PositionSchema,
  placeName: String
})

BombStatusChangeSchema.plugin(autoPopulateAllFields);
export const BombStatusChange = mongoose.model<IBombStatusChange>('BombStatusChange', BombStatusChangeSchema);

