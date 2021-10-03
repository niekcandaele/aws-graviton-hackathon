import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';


export interface IPlayer extends Document {
  steamId: string
  rank: number
  name: string
}

export const PlayerSchema = new Schema<IPlayer>({
  steamId: String,
  rank: Number,
  name: String
})


export const Player = mongoose.model('Player', PlayerSchema);
