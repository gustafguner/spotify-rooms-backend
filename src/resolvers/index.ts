import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import {
  rooms,
  room,
  enterRoom,
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
  subscribeToUserEnteredRoom,
  subscribeToUserLeftRoom,
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
    enterRoom,
    leaveRoom,
  },
  Subscription: {
    trackAddedToQueue: subscribeToTrackAddedToQueue,
    trackVotedOnInQueue: subscribeToTrackVotedOnInQueue,
    trackRemovedFromQueue: subscribeToTrackRemovedFromQueue,
    playback: subscribeToPlayback,
    userEnteredRoom: subscribeToUserEnteredRoom,
    userLeftRoom: subscribeToUserLeftRoom,
  },
};

export { resolvers };
