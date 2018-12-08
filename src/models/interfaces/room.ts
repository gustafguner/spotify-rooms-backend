import * as mongoose from 'mongoose';

export interface IRoom extends mongoose.Document {
  name: string;
  host: string;
  users: string[];
  playback: {
    isPlaying: boolean;
    uri: string;
    name: string;
  };
}
