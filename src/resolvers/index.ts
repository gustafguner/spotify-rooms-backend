import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import {
  rooms,
  room,
  createRoom,
  addTrackToQueue,
  voteForTrack,
  subscribeToTrackAddedToQueue,
  subscribeToTrackVotedOnInQueue,
} from './rooms';

const resolvers: Resolver = {
  Query: {
    user,
    rooms,
    room,
  },
  Mutation: {
    createRoom,
    addTrackToQueue,
    voteForTrack,
  },
  Subscription: {
    trackAddedToQueue: subscribeToTrackAddedToQueue,
    trackVotedOnInQueue: subscribeToTrackVotedOnInQueue,
  },
};

export { resolvers };
