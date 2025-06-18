// src/index.ts

import 'dotenv/config';        // garante que .env seja lido antes de process.env
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/typeDefs';
import { root } from './graphql/resolvers';

async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const PORT = parseInt(process.env.PORT || '4000', 10);

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não está definida no .env');
    process.exit(1);
  }

  // 1) Conectar ao MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', (err as Error).message);
    process.exit(1);
  }

  // 2) Criar instância do Express
  const app = express();

  // 3) Configurar CORS
  app.use(cors({ origin: '*', credentials: true }));

  // 4) Rota GraphQL
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  // 5) Rota de sanity check
  app.get('/', (_req, res) => {
    res.send(
      'API de Usuários (GraphQL via express-graphql) no ar! Acesse /graphql'
    );
  });

  // 6) Iniciar server
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
