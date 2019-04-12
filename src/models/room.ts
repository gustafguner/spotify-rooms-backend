import * as mongoose from 'mongoose';

import { IRoom } from './interfaces/room';
import { ITrack } from './interfaces/track';

const Track = {
  id: { type: String },
  uri: { type: String },
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
  voters: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  duration: { type: Number },
  queueTimestamp: { type: Date, default: Date.now },
  playTimestamp: { type: Date },
};

export const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mode: { type: String, required: true },
  private: { type: Boolean, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] },
  playback: Track,
  queue: [Track],
  suggestions: [Track],
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
