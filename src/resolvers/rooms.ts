import { QueryToRoomsResolver } from '../typings/generated-graphql-schema-types';
import { MutationToCreateRoomResolver } from '../typings/generated-graphql-schema-types';

import Room from '../models/room';

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  console.log(user);
  const rooms = await Room.find({});
  return rooms;
};

const createRoom: MutationToCreateRoomResolver = async (
  root,
  { input },
  { user },
) => {
  const room = new Room(input);
  room.save((err, room) => {
    return true;
  });
  return true;
};

export { rooms, createRoom };
