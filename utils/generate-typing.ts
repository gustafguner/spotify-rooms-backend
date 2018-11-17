import { generateTypeScriptTypes } from 'graphql-schema-typescript';
import { readFileSync, readFile } from 'fs';
import { resolve } from 'path';

const schema = readFileSync(resolve('./src/schema.graphqls'), 'utf8');

generateTypeScriptTypes(
  schema,
  './src/typings/generated-graphql-schema-types.ts',
)
  .then(() => {
    console.log('Typings successfully generated');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to generate typings ', error);
    process.exit(1);
  });
