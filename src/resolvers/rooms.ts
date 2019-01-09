import {
  QueryToRoomsResolver,
  QueryToRoomResolver,
  MutationToCreateRoomResolver,
  MutationToAddTrackToQueueResolver,
  MutationToVoteForTrackResolver,
  SubscriptionToTrackAddedToQueueResolver,
  SubscriptionToTrackVotedOnInQueueResolver,
  SubscriptionToTrackRemovedFromQueueResolver,
  SubscriptionToPlayTrackResolver,
  QueryToPlaybackResolver,
  SubscriptionToPlaybackResolver,
} from '../typings/generated-graphql-schema-types';
import { PubSub, withFilter } from 'graphql-subscriptions';
import Room from '../models/room';
import { getSpotifyInstance } from '../spotify';
import to from 'await-to-js';

const pubsub = new PubSub();

const rooms: QueryToRoomsResolver = async (root, input, { user }) => {
  const [err, rooms] = await to(
    Room.find({})
      .populate('host')
      .exec(),
  );

  if (err) {
    throw new Error('Unexpected server error');
  }

  return rooms;
};

const room: QueryToRoomResolver = async (root, input, { user }) => {
  let [err, room] = await to(
    Room.findById(input.query)
      .populate('host')
      .populate('queue.voters')
      .exec(),
  );
  const position = room.playback.id
    ? Date.now() - room.playback.playTimestamp.getTime()
    : 0;

  if (err) {
    throw new Error('Unexpected server error');
  }

  room.playback.position = position;

  return room;
};

const playback: QueryToPlaybackResolver = async (
  root,
  { roomId },
  { user },
) => {
  const [err, room] = await to(
    Room.findById(roomId)
      .populate('host')
      .populate('queue.voters')
      .exec(),
  );
  const position = room.playback.id
    ? Date.now() - room.playback.playTimestamp.getTime()
    : 0;

  if (err || !room) {
    throw new Error('Unexpected server error');
  }
  return {
    ...room.playback,
    position,
  };
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
  getSpotifyInstance(user._id)
    .api.getTracks([input.trackId])
    .then(async ({ body }) => {
      let err, foundRoom;

      const track = body.tracks[0];

      if (!track) {
        return false;
      }

      const id = track.id;
      const uri = track.uri;
      const name = track.name;
      const artists = track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      }));
      const images = track.album.images;
      const duration = track.duration_ms;

      console.log('Duration: ' + duration);

      const trackToAdd = {
        id,
        uri,
        name,
        artists,
        images,
        voters: [],
        duration,
        queueTimestamp: Date.now(),
      };

      [err, foundRoom] = await to(Room.findById(input.roomId).exec());

      if (!foundRoom || err) {
        return false;
      }

      console.log('Track to add ', trackToAdd.name);

      foundRoom.queue.push(trackToAdd);

      [err] = await to(foundRoom.save());

      if (err) {
        return false;
      }

      if (!foundRoom.playback.id) {
        console.log('play() !!!');
        play(foundRoom._id);
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

const play = async (roomId: string) => {
  let err, room;
  [err, room] = await to(
    Room.findById(roomId)
      .populate('queue.voters')
      .exec(),
  );
  if (room.queue.length > 0) {
    const queue = room.queue;
    queue.sort((a, b) => {
      return (
        b.voters.length - a.voters.length || a.queueTimestamp - b.queueTimestamp
      );
    });
    let track = queue.shift();
    track.playTimestamp = Date.now();

    room.queue = queue;
    room.playback = track;

    [err, room] = await to(room.save());

    pubsub.publish('TRACK_REMOVED_FROM_QUEUE', {
      trackRemovedFromQueue: track,
      roomId,
    });

    if (err) {
      return;
    }
    console.log('PLAY_TRACK: ' + track.name);

    track.position = 0;

    console.log('PLAYBACK publish');
    pubsub.publish('PLAYBACK', {
      playback: track,
      roomId,
    });

    setTimeout(() => {
      play(roomId);
    }, track.duration + 2000);
  } else {
    room.playback = null;
    [err, room] = await to(room.save());
    console.log('CLEARED PLAYBACK');
    pubsub.publish('PLAYBACK', {
      playback: null,
      roomId,
    });
  }
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

const subscribeToPlayTrack: SubscriptionToPlayTrackResolver = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('PLAY_TRACK'),
    (payload, { roomId }) => {
      return payload.roomId == roomId;
    },
  ),
};

const subscribeToPlayback: SubscriptionToPlaybackResolver = {
  subscribe: withFilter(
    () => pubsub.asyncIterator('PLAYBACK'),
    (payload, { roomId }) => {
      return payload.roomId == roomId;
    },
  ),
};

export {
  rooms,
  room,
  playback,
  createRoom,
  addTrackToQueue,
  voteForTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
  subscribeToTrackRemovedFromQueue,
  subscribeToPlayTrack,
  subscribeToPlayback,
};
