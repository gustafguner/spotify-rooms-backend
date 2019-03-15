import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  spotifyId: string;
  accessToken: string;
  refreshToken: string;
  expires: number;
  displayName: string;
  email?: string;
  country?: string;
  image?: string;
}
