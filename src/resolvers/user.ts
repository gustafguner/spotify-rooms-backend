import { QueryToUserResolver } from '../typings/generated-graphql-schema-types';

import User from '../models/user';

const user: QueryToUserResolver = async (root, args) => {
  return User.findById(args.query);
};

export { user };
