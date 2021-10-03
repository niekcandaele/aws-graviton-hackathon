import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { RoundType } from '../demo/type/RoundTypeEnum';
import { TeamType } from '../demo/type/TeamType';
import { IBombStatusChange } from './BombStatusChange';
import { IPlayerHurt } from './PlayerHurt';
import { IPlayerKill } from './PlayerKill';
import { autoPopulateAllFields } from './populateHook';
import { ITeam } from './Team';

export interface IRound extends Document {
  kills: IPlayerKill[]
  playerHurts: IPlayerHurt[]
  bombStatusChanges: IBombStatusChange[]
  officialEndTick: Number
  endTick: Number
  startTick: Number
  endReason: Number
  type: RoundType
  winningTeam: ITeam | undefined
  winningSide: TeamType
}

export const RoundSchema = new Schema<IRound>({
  kills: [{type: Schema.Types.ObjectId, ref: 'PlayerKill'}],
  playerHurts: [{type: Schema.Types.ObjectId, ref: 'PlayerHurt'}],
  bombStatusChanges: [{type: Schema.Types.ObjectId, ref: 'BombStatusChange'}],
  officialEndTick: Number,
  endTick: Number,
  startTick: Number,
  endReason: Number,
  type: {type: String, enum: Object.values(RoundType)},
  winningTeam: {type: Schema.Types.ObjectId, ref: 'Team'},
  winningSide: {type: String, enum: Object.values(TeamType)},
})

RoundSchema.plugin(autoPopulateAllFields);
export const Round = mongoose.model<IRound>('Round', RoundSchema);

