import { gql } from '@apollo/client';

export const typeDefs = gql`
  extend input NewUserInput {
    avatar_url: String
    email: String!
    first_name: String!
    kid: String!
    last_name: String!
    username: String!
  }
`;
