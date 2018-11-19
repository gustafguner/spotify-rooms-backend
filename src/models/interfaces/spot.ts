import * as mongoose from 'mongoose';

export interface ISpot extends mongoose.Document {
  spotifyId: string;
  displayName: string;
  email: string;
  country: string;
}
