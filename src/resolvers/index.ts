import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import {
  rooms,
  room,
  createRoom,
  addTrackToQueue,
  voteForTrack,
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
};

export { resolvers };
