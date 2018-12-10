import * as mongoose from 'mongoose';
import { ITrack } from './track';

export interface IRoom extends mongoose.Document {
  name: string;
  host: string;
  users: string[];
  playback?: ITrack;
  queue?: ITrack[];
}
