import {
  QueryToRoomsResolver,
  QueryToRoomResolver,
  MutationToCreateRoomResolver,
  MutationToAddTrackToQueueResolver,
  MutationToVoteForTrackResolver,
} from '../typings/generated-graphql-schema-types';
import Room from '../models/room';
import { getSpotifyInstance } from '../spotify';
import to from 'await-to-js';

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  return await Room.find({})
    .populate('host')
    .exec();
};

const room: QueryToRoomResolver = async (root, input, { user }) => {
  return await Room.findById(input.query)
    .populate('host')
    .populate('queue.voters')
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
    .api.getTracks([input.trackId])
    .then(async ({ body }) => {
      let err, foundRoom;

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

      [err, foundRoom] = await to(Room.findById(input.roomId).exec());

      if (!foundRoom || err) {
        return false;
      }

      foundRoom.queue.push({
        id,
        name,
        artists,
        images,
      });

      [err] = await to(foundRoom.save());

      if (err) {
        return false;
      }

      return true;
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
  return true;
};

const voteForTrack: MutationToVoteForTrackResolver = async (
  root,
  { input },
  { user },
) => {
  console.log('Room ID: ' + input.roomId);
  console.log('Track ID: ' + input.trackId);
  const [err, foundRoom] = await to(Room.findById(input.roomId).exec());
  if (!foundRoom || err) {
    // TODO: Also check that user.id is in users/listeners of the room (i.e. not voting for a track in another room)
    return false;
  }

  foundRoom.queue.forEach((track) => {
    if (track.id === input.trackId) {
      track.voters.push(user.id);
      return;
    }
  });

  foundRoom.save();

  return true;
};

export { rooms, room, createRoom, addTrackToQueue, voteForTrack };
