import { readFileSync } from 'fs';
import { resolve } from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(resolve(__dirname, './schema.graphqls'), 'utf8');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { schema };
