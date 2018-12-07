import { QueryToRoomsResolver } from '../typings/generated-graphql-schema-types';

const rooms: QueryToRoomsResolver = async () => {
  return [{ id: 123 }];
};

export { rooms };
