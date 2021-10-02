import mongoose from 'mongoose';
import { Document } from 'mongoose';

import { BombStatusChange } from './BombStatusChange';
import { Match } from './Match';
import { Player } from './Player';
import { PlayerInfo } from './PlayerInfo';
import { PlayerKill } from './PlayerKill';
import { Round } from './Round';
import { Team } from './Team';


const { Schema } = mongoose

export async function getMongoose() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined')
  }

  await mongoose.connect(process.env.MONGODB_URI);

  return {
    Match,
    Player,
    PlayerInfo,
    BombStatusChange,
    PlayerKill,
    Round,
    Team
  }
}












