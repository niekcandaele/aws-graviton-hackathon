import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPlayerInfo } from './PlayerInfo';

export interface IPlayerBlind extends Document {
  tick: Number
  attacker: IPlayerInfo,
  victim: IPlayerInfo,
  duration: Number,
}

export const PlayerBlindSchema = new Schema<IPlayerBlind>({
  tick: Number,
  attacker: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  victim: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  duration: Number,
})

export const PlayerBlind = mongoose.model<IPlayerBlind>('PlayerBlind', PlayerBlindSchema);

