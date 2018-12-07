import * as mongoose from 'mongoose';

import { IRoom } from './interfaces/room';

export const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Room = mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
