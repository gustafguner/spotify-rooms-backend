import { QueryToRoomsResolver } from '../typings/generated-graphql-schema-types';
import { MutationToCreateRoomResolver } from '../typings/generated-graphql-schema-types';

import Room from '../models/room';

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  return await Room.find({})
    .populate('host')
    .exec();
};

const createRoom: MutationToCreateRoomResolver = async (
  root,
  { input },
  { user },
) => {
  if (!user) return false;

  console.log(input);
  console.log(user);
  const room = new Room({
    ...input,
    host: user._id,
  });
  room.save((err, room) => {
    return true;
  });
  return true;
};

export { rooms, createRoom };
