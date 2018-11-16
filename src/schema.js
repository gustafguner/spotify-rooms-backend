module.exports = `
type Author {
  id: ID!
  firstName: String
  lastName: String
}

type Query {
  authors: [Author]
}

schema {
  query: Query
}
`;
