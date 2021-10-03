import { Document, Schema } from 'mongoose';
import mongoose from 'mongoose';
import deepPopulate from 'mongoose-deep-populate';
import mongoosePaginate from 'mongoose-paginate';

import { IPlayer, PlayerSchema } from './Player';
import { IRound, RoundSchema } from './Round';
import { ITeam } from './Team';

export interface IMatch extends Document {
  demoUrl: string
  rounds: IRound[]
  teams: ITeam[]
  durationTicks: number
  map: string
  tickrate: number
  date: Date
  players: IPlayer[]
}

export const MatchSchema = new Schema<IMatch>({
  demoUrl: {type: String},
  rounds: [{type: Schema.Types.ObjectId, ref: 'Round'}],
  teams: [{type: Schema.Types.ObjectId, ref: 'Team'}],
  durationTicks: Number,
  map: String,
  tickrate: Number,
  date: Date
})

MatchSchema.plugin(mongoosePaginate);
MatchSchema.plugin(deepPopulate(mongoose))

export const Match = mongoose.model<IMatch>('Match', MatchSchema);
