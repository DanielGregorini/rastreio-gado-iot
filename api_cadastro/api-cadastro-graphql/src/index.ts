import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { graphqlHTTP } from "express-graphql";

import { schema } from "./graphql/typeDefs";
import { root } from "./graphql/resolvers";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";
const PORT = process.env.PORT || "4000";

async function startServer() {
  // 1) Conectar ao MongoDB
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", (err as Error).message);
    process.exit(1);
  }

  // 2) Criar instância do Express
  const app = express();

  // 3) Configurar CORS (front-end pode estar em outra porta/dominio)
  app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(
    "/graphql",
    graphqlHTTP({
      schema,          
      rootValue: root, 
      graphiql: true,
    })
  );

  app.get("/", (_req, res) => {
    res.send("API de Usuários (GraphQL via express-graphql) no ar! Acesse /graphql");
  });

  app.listen({ port: Number(PORT) }, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error("Erro ao iniciar servidor:", err);
});
