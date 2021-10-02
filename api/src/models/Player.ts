import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';


export interface IPlayer extends Document {
  steamId: string
  rank: number
}

export const PlayerSchema = new Schema<IPlayer>({
  steamId: String,
  rank: Number,
})


export const Player = mongoose.model('Player', PlayerSchema);
