import * as mongoose from 'mongoose';

import { IUser } from './interfaces/user';

export const UserSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: false },
  country: { type: String, required: false },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
