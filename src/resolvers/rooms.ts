import { QueryToRoomsResolver } from '../typings/generated-graphql-schema-types';
import { MutationToCreateRoomResolver } from '../typings/generated-graphql-schema-types';

import Room from '../models/room';

const rooms: QueryToRoomsResolver = async () => {
  Room.find({}, (err, rooms) => {
    if (err) {
      return [];
    }
    return rooms;
  });
};

const createRoom: MutationToCreateRoomResolver = async (root, { input }) => {
  const room = new Room(input);
  room.save((err, room) => {
    return true;
  });
  return true;
};

export { rooms, createRoom };
