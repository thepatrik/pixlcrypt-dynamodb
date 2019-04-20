const { buildSchema } = require("graphql");
const schema = buildSchema(`
  type User {
    email: String!
    name: String!
  }
  type Item {
    id: String!
    src: String!
    caption: String!
    description: String!
    mime: String!
    contentType: String!
    dateAdded: String!
  }
  type Query {
    user(email: String!):User
    items(id: String, userId: String!): [Item]
  }
`);

module.exports.getSchema = () => {
    return schema;
};
