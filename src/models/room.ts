import * as mongoose from 'mongoose';

import { IRoom } from './interfaces/room';

export const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  playback: {
    isPlaying: { type: Boolean },
    uri: { type: String },
    name: { type: String },
  },
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
