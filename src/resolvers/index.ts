const resolvers = {
  Query: {
    authors() {
      return [{ id: 199 }];
    },
  },
};

export { resolvers };
