import * as mongoose from 'mongoose';

import { IRoom } from './interfaces/room';
import { ITrack } from './interfaces/track';

const Track = {
  id: { type: String },
  name: { type: String },
  artists: [
    {
      id: { type: String },
      name: { type: String },
    },
  ],
  images: [
    {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
    },
  ],
};

export const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  playback: Track,
  queue: [Track],
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
