import {
  QueryToRoomsResolver,
  QueryToRoomResolver,
  MutationToCreateRoomResolver,
} from '../typings/generated-graphql-schema-types';
import Room from '../models/room';

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  return await Room.find({})
    .populate('host')
    .exec();
};

const room: QueryToRoomResolver = async (root, input, { user }) => {
  console.log(input);
  return await Room.findOne({ _id: input.query })
    .populate('host')
    .exec();
};

const createRoom: MutationToCreateRoomResolver = async (
  root,
  { input },
  { user },
) => {
  if (!user) return false;

  const room = new Room({
    ...input,
    host: user._id,
  });

  room.save((err, room) => {
    return true;
  });
  return true;
};

export { rooms, room, createRoom };
