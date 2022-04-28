import { gql } from 'apollo-server';

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    passwordHash: String
    sessionId: Int
  }
  type Error {
    message: string
  }

  type Books {
    id: ID!
    title: String
    author: String
    user_if: ID!
    summary: String
    category_id: ID!
  }

  type Query {
    users: [User]
    user: User
  }

  type Mutation {
    createUser(
      username: String!
      email: String!
      pwHash: String!
    )
  }
`;
