import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import {
  rooms,
  room,
  joinRoom,
  leaveRoom,
  usersInRoom,
  playback,
  queue,
  createRoom,
  addTrackToQueue,
  voteForTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
  subscribeToTrackRemovedFromQueue,
  subscribeToPlayback,
  subscribeToUsersInRoom,
} from './rooms';

const resolvers: Resolver = {
  Query: {
    user,
    rooms,
    room,
    playback,
    queue,
    usersInRoom,
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
    usersInRoom: subscribeToUsersInRoom,
  },
};

export { resolvers };
