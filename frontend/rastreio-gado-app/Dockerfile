# api-cadastro-graphql/Dockerfile

# 1) instalar dependências
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) build da aplicação
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# desabilita a telemetria do Next na build
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) runtime
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copia só o que é necessário para rodar em produção
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm","run","start"]
