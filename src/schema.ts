import { readFileSync } from 'fs';
import { resolve } from 'path';
import { makeExecutableSchema, IResolvers } from 'graphql-tools';
import { resolvers } from './resolvers';

const typeDefs = readFileSync(resolve(__dirname, './schema.graphqls'), 'utf8');

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolvers as IResolvers<any, any>,
});

export { schema };
