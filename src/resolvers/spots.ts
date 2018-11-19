import { QueryToSpotsResolver } from '../typings/generated-graphql-schema-types';

const spots: QueryToSpotsResolver = async () => {
  return [{ id: 123 }];
};

export { spots };
