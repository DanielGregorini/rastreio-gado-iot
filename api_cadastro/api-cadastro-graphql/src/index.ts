import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Servidor pronto em ${url}`);
});
