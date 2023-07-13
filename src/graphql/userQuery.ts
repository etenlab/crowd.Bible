import { gql } from '@apollo/client';

export const USER_FIELDS = gql`
  fragment UserFields on User {
    active
    avatar_url
    created_at
    email
    first_name
    is_email_verified
    kid
    last_name
    user_id
    username
  }
`;

export const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation CreateUser($newUserData: NewUserInput!) {
    createUser(newUserData: $newUserData) {
      ...UserFields
    }
  }
`;

export const UPDATE_USER = gql`
  ${USER_FIELDS}
  mutation UpdateUser($id: String!, $newUserData: NewUserInput!) {
    updateUser(id: $id, newUserData: $newUserData) {
      ...UserFields
    }
  }
`;

export const GET_USER = gql`
  ${USER_FIELDS}
  query GetUser($id: String, $kid: String, $username: String, $email: String) {
    getUser(id: $id, kid: $kid, username: $username, email: $email) {
      ...UserFields
    }
  }
`;
