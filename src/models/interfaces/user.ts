import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  spotifyId: string;
  displayName: string;
  email: string;
  country: string;
}
