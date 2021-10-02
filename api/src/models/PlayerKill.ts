import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPlayerInfo } from './PlayerInfo';

export interface IPlayerKill extends Document {
  tick: Number
  throughSmoke: boolean,
  throughWall: boolean,
  whileBlind: boolean,
  attacker: IPlayerInfo,
  victim: IPlayerInfo,
  assister: IPlayerInfo,
}

export const PlayerKillSchema = new Schema<IPlayerKill>({
  tick: Number,
  throughSmoke: Boolean,
  throughWall: Boolean,
  whileBlind: Boolean,
  attacker: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  victim: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
  assister: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},

})

export const PlayerKill = mongoose.model<IPlayerKill>('PlayerKill', PlayerKillSchema);

