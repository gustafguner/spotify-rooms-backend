import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import { rooms, createRoom } from './rooms';

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
