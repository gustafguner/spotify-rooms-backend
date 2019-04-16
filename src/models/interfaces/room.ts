import * as mongoose from 'mongoose';
import { ITrack } from './track';
import { IUser } from './user';

export interface IRoom extends mongoose.Document {
  name: string;
  mode: 'co-op' | 'dj';
  private: boolean;
  host: IUser;
  dj?: IUser;
  users: IUser[];
  playback?: ITrack;
  queue?: ITrack[];
  requests?: ITrack[];
}
