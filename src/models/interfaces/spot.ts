import * as mongoose from 'mongoose';

export interface ISpot extends mongoose.Document {
  displayName: string;
  email: string;
  spotifyId: string;
}
