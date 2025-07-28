import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import amqp from 'amqplib';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './graphql/typeDefs';
import { root } from './graphql/resolvers';

// 🔧 Configurações padrão com fallback
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';
const QUEUE = process.env.RABBITMQ_QUEUE || 'user-created';
const EXCHANGE = process.env.RABBITMQ_EXCHANGE || 'user.exchange';
const ROUTING_KEY = process.env.RABBITMQ_ROUTING_KEY || 'user-created';

let channel: amqp.Channel;

// 🔌 Conexão com RabbitMQ com múltiplas tentativas
async function connectRabbitMQ(retries = 10, delay = 3000): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      const connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
      await channel.assertQueue(QUEUE, { durable: true });
      await channel.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);

      console.log('✅ Conectado ao RabbitMQ');
      return;
    } catch (err: any) {
      console.error(`❌ Tentativa ${i}/${retries} - Erro ao conectar ao RabbitMQ: ${err.message}`);
      if (i < retries) {
        console.log(`⏳ Aguardando ${delay / 1000} segundos para tentar novamente...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error('💥 Falha ao conectar ao RabbitMQ após várias tentativas. Encerrando...');
        process.exit(1);
      }
    }
  }
}

export function sendToQueue(routingKey: string, message: object) {
  if (!channel) {
    console.error('❌ Canal RabbitMQ não inicializado.');
    return;
  }

  channel.publish(EXCHANGE, routingKey, Buffer.from(JSON.stringify(message)));
  console.log(`📤 Mensagem enviada: ${JSON.stringify(message)}`);
}

// 🚀 Inicializa MongoDB e servidor Express
async function startServer() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const PORT = parseInt(process.env.PORT || '4000', 10);

  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI não está definida no .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (err) {
    console.error('❌ Erro ao conectar ao MongoDB:', (err as Error).message);
    process.exit(1);
  }

  const app = express();
  app.use(cors());

  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: root,
      graphiql: true,
    })
  );

  app.get('/', (_req, res) => {
    res.send('🚀 API de Usuários no ar! Acesse /graphql');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphql`);
  });
}

// 🧠 Bootstrap geral
async function bootstrap() {
  await connectRabbitMQ();
  await startServer();

  // 🔁 TESTE DE ENVIO PARA RABBITMQ AUTOMÁTICO
  /*
  let count = 1;
  setInterval(() => {
    const fakeUser = {
      id: `user-${count}`,
      name: `Usuário ${count}`,
      email: `usuario${count}@teste.com`,
    };
    sendToQueue(ROUTING_KEY, fakeUser);
    count++;
  }, 1000);
  */
}

bootstrap();
