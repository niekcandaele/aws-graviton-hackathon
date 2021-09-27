import mongoose from 'mongoose';
import { Document } from 'mongoose';

import { Match } from './Match';
import { Player } from './Player';
import { PlayerInfo } from './PlayerInfo';


const { Schema } = mongoose

export async function getMongoose() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  await mongoose.connect(process.env.MONGODB_URI);

  return {
    Match,
    Player,
    PlayerInfo
  }
}












