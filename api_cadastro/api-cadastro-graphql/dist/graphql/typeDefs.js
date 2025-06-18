"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
exports.schema = (0, graphql_1.buildSchema)(`
  #############################
  # Tipo User, sem expor senha
  #############################
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String
    updatedAt: String
  }

  #################################################
  # Inputs para criar e atualizar um User
  #################################################
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    id: ID!
    name: String
    email: String
    password: String
  }

  #################################################
  # Queries disponíveis
  #################################################
  type Query {
    # lista todos os usuários (sem password)
    users: [User!]!

    # busca um usuário pelo ID (ou null se não encontrar)
    user(id: ID!): User
  }

  #################################################
  # Mutations disponíveis
  #################################################
  type Mutation {
    # cria um novo usuário
    createUser(input: CreateUserInput!): User!

    # atualiza dados de um usuário existente
    updateUser(input: UpdateUserInput!): User!

    # deleta um usuário pelo ID, retorna true/false
    deleteUser(id: ID!): Boolean!
  }
`);
