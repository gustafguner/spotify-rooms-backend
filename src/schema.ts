import { readFileSync } from 'fs';
import { resolve } from 'path';

const typeDefs = readFileSync(resolve(__dirname, './schema.graphqls'), 'utf8');

export { typeDefs };
