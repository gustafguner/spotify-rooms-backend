import {
  QueryToRoomsResolver,
  QueryToRoomResolver,
  MutationToCreateRoomResolver,
  MutationToAddTrackToQueueResolver,
} from '../typings/generated-graphql-schema-types';
import Room from '../models/room';
import { getSpotifyInstance } from '../spotify';

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  return await Room.find({})
    .populate('host')
    .exec();
};

const room: QueryToRoomResolver = async (root, input, { user }) => {
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

const addTrackToQueue: MutationToAddTrackToQueueResolver = async (
  root,
  { input },
  { user },
) => {
  console.log(input);
  console.log(user);
  getSpotifyInstance(user._id)
    .api.getTracks([input.id])
    .then(({ body }) => {
      console.log(body);

      const track = body.tracks[0];

      if (!track) {
        return false;
      }

      const id = track.id;
      const name = track.name;
      const artists = track.artists.map((artist) => {
        return {
          id: artist.id,
          name: artist.name,
        };
      });
      const images = track.album.images;

      // Insert track to correct queue
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
  return true;
};

export { rooms, room, createRoom, addTrackToQueue };
