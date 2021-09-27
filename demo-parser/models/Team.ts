import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';

import { TeamType } from '../demo/type/TeamType';
import { IPlayer, PlayerSchema } from './Player';
import { IRound, RoundSchema } from './Round';

export interface ITeam extends Document {
  handle: Number,
  players: (IPlayer|undefined)[],
  startingSide: TeamType,
  name: string
}

export const TeamSchema = new Schema<ITeam>({
  startingSide: {type: String, enum: Object.values(TeamType)},
  name: String,
  handle: Number,
  players: [{type: Schema.Types.ObjectId, ref: 'Player'}],
})

export const Team = mongoose.model<ITeam>('Team', TeamSchema);
