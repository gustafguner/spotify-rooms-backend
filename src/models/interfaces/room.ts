import * as mongoose from 'mongoose';
import { ITrack } from './track';
import { IUser } from './user';

export interface IRoom extends mongoose.Document {
  name: string;
  host: IUser;
  users: IUser[];
  playback?: ITrack;
  queue?: ITrack[];
}
