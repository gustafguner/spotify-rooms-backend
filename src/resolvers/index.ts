import { Resolver } from '../typings/generated-graphql-schema-types';

import { spots } from './spots';

const resolvers: Resolver = {
  Query: {
    spots,
  },
};

export { resolvers };
