import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Livro {
    id: ID!
    titulo: String!
    autor: String!
    ano: Int
  }

  type Query {
    livros: [Livro]
    livro(id: ID!): Livro
  }

  type Mutation {
    criarLivro(titulo: String!, autor: String!, ano: Int): Livro
    atualizarLivro(id: ID!, titulo: String, autor: String, ano: Int): Livro
    deletarLivro(id: ID!): Livro
  }
`;
