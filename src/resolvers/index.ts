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
  requests,
  createRoom,
  updateRoom,
  addTrackToQueue,
  voteForTrackInQueue,
  acceptRequestedTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
  subscribeToTrackRemovedFromQueue,
  subscribeToRoom,
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
    requests,
    usersInRoom,
  },
  Mutation: {
    createRoom,
    updateRoom,
    addTrackToQueue,
    voteForTrackInQueue,
    acceptRequestedTrack,
    enterRoom,
    leaveRoom,
  },
  Subscription: {
    trackAddedToQueue: subscribeToTrackAddedToQueue,
    trackVotedOnInQueue: subscribeToTrackVotedOnInQueue,
    trackRemovedFromQueue: subscribeToTrackRemovedFromQueue,
    room: subscribeToRoom,
    playback: subscribeToPlayback,
    userEnteredRoom: subscribeToUserEnteredRoom,
    userLeftRoom: subscribeToUserLeftRoom,
  },
};

export { resolvers };
