import {
  QueryToRoomsResolver,
  QueryToRoomResolver,
  MutationToCreateRoomResolver,
  MutationToAddTrackToQueueResolver,
  MutationToVoteForTrackResolver,
  SubscriptionToTrackAddedToQueueResolver,
  SubscriptionToTrackVotedOnInQueueResolver,
  SubscriptionToTrackRemovedFromQueueResolver,
} from '../typings/generated-graphql-schema-types';
import { PubSub, withFilter } from 'graphql-subscriptions';
import Room from '../models/room';
import { getSpotifyInstance } from '../spotify';
import to from 'await-to-js';

const pubsub = new PubSub();

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  console.log(user);
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

      const trackToAdd = {
        id,
        name,
        artists,
        images,
        voters: [],
        timestamp: Date.now(),
      };

      [err, foundRoom] = await to(Room.findById(input.roomId).exec());

      if (!foundRoom || err) {
        return false;
      }

      foundRoom.queue.push(trackToAdd);

      [err] = await to(foundRoom.save());

      if (err) {
        return false;
      }

      pubsub.publish('TRACK_ADDED_TO_QUEUE', {
        trackAddedToQueue: trackToAdd,
        roomId: foundRoom._id,
      });

      return trackToAdd;
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
  const [err, foundRoom] = await to(Room.findById(input.roomId).exec());
  if (!foundRoom || err) {
    // TODO: Also check that user.id is in users/listeners of the room (i.e. not voting for a track in another room)
    return false;
  }

  const queueIndex = foundRoom.queue.findIndex((t) => t.id === input.trackId);
  if (queueIndex === -1) {
    return false;
  }

  const track = foundRoom.queue[queueIndex];
  const i = track.voters.indexOf(user._id);
  if (i === -1) {
    track.voters.push(user._id);
  } else {
    track.voters.splice(i, 1);
  }

  foundRoom[queueIndex] = track;

  await Room.populate(foundRoom, { path: 'queue.voters' });

  pubsub.publish('TRACK_VOTED_ON_IN_QUEUE', {
    trackVotedOnInQueue: foundRoom[queueIndex],
    roomId: foundRoom._id,
  });

  foundRoom.save();
  return true;
};

const subscribeToTrackAddedToQueue: SubscriptionToTrackAddedToQueueResolver = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('TRACK_ADDED_TO_QUEUE'),
    (payload, { input }) => {
      return payload.roomId == input.roomId;
    },
  ),
};

const subscribeToTrackVotedOnInQueue: SubscriptionToTrackVotedOnInQueueResolver = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('TRACK_VOTED_ON_IN_QUEUE'),
    (payload, { input }) => {
      return payload.roomId == input.roomId;
    },
  ),
};

const subscribeToTrackRemovedFromQueue: SubscriptionToTrackRemovedFromQueueResolver = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('TRACK_REMOVED_FROM_QUEUE'),
    (payload, { input }) => {
      return payload.roomId == input.roomId;
    },
  ),
};

export {
  rooms,
  room,
  createRoom,
  addTrackToQueue,
  voteForTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
  subscribeToTrackRemovedFromQueue,
};
