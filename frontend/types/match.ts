export interface Match {
  _id: string;
  rounds: string[];
  teams: string[];
  durationTicks: number;
  map: string;
  tickrate: number;
  date: Date;
  __v: number;
}