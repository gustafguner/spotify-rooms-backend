import { Resolver } from '../typings/generated-graphql-schema-types';

import { user } from './user';
import { spots } from './spots';

const resolvers: Resolver = {
  Query: {
    user,
    spots,
  },
};

export { resolvers };
