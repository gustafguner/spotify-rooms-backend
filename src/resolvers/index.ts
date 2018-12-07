import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import { rooms } from './rooms';

import { createRoom } from './createRoom';

const resolvers: Resolver = {
  Query: {
    user,
    rooms,
  },
  Mutation: {
    createRoom,
  },
};

export { resolvers };
