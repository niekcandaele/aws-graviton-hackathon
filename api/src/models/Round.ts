import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IBombStatusChange } from './BombStatusChange';
import { IPlayerKill } from './PlayerKill';
import { ITeam } from './Team';
import { RoundType } from './type/RoundTypeEnum';

export interface IRound extends Document {
  kills: IPlayerKill[]
  bombStatusChanges: IBombStatusChange[]
  officialEndTick: Number
  endTick: Number
  startTick: Number
  endReason: Number
  type: RoundType
  winningTeam: ITeam | undefined
}

export const RoundSchema = new Schema<IRound>({
  kills: [{type: Schema.Types.ObjectId, ref: 'PlayerKill'}],
  bombStatusChanges: [{type: Schema.Types.ObjectId, ref: 'BombStatusChange'}],
  officialEndTick: Number,
  endTick: Number,
  startTick: Number,
  endReason: Number,
  type: {type: String, enum: Object.values(RoundType)},
  winningTeam: {type: Schema.Types.ObjectId, ref: 'Team'}
})

export const Round = mongoose.model<IRound>('Round', RoundSchema);

