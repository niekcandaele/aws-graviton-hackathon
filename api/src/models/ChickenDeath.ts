import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { IPlayerInfo } from './PlayerInfo';


export interface IChickenDeath extends Document {
  tick: Number
  throughSmoke: boolean,
  throughWall: boolean,
  whileBlind: boolean,
  attacker: IPlayerInfo,
  weapon: string
}

export const ChickenDeathSchema = new Schema<IChickenDeath>({
  tick: Number,
  throughSmoke: Boolean,
  throughWall: Boolean,
  whileBlind: Boolean,
  weapon: String,
  attacker: {type: Schema.Types.ObjectId, ref: 'PlayerInfo'},
})


export const ChickenDeath = mongoose.model<IChickenDeath>('ChickenDeath', ChickenDeathSchema);

