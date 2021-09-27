import { Document, Schema } from 'mongoose';

export interface IPosition {
  x: number;
  y: number;
  z: number;
}

export const PositionSchema = new Schema({
  x: Number,
  y: Number,
  z: Number,
})
