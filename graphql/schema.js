const { gql } = require("graphql-tag");

module.exports = gql`

  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    todos: [Todo]
  }

  type UserResponse {
    data: User!
    message: String!
  }
  type AuthPayload {
    user: User!
    token: String!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    image: String
    user: User
  }

  type Query {
    users: [User]
    todos: [Todo]
    todosByUser(userId: ID!): [Todo]
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): UserResponse
    login(email: String!, password: String!): AuthPayload
    createTodo(title: String!, userId: ID!): Todo
    toggleTodo(id: ID!): Todo
  }
`;
