import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import {
  rooms,
  room,
  joinRoom,
  leaveRoom,
  playback,
  queue,
  createRoom,
  addTrackToQueue,
  voteForTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
  subscribeToTrackRemovedFromQueue,
  subscribeToPlayback,
} from './rooms';

const resolvers: Resolver = {
  Query: {
    user,
    rooms,
    room,
    playback,
    queue,
  },
  Mutation: {
    createRoom,
    addTrackToQueue,
    voteForTrack,
    joinRoom,
    leaveRoom,
  },
  Subscription: {
    trackAddedToQueue: subscribeToTrackAddedToQueue,
    trackVotedOnInQueue: subscribeToTrackVotedOnInQueue,
    trackRemovedFromQueue: subscribeToTrackRemovedFromQueue,
    playback: subscribeToPlayback,
  },
};

export { resolvers };
