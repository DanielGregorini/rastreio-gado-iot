"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_graphql_1 = require("express-graphql");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./graphql/resolvers");
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "";
const PORT = process.env.PORT || "4000";
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1) Conectar ao MongoDB
        try {
            yield mongoose_1.default.connect(MONGODB_URI);
            console.log("✅ Conectado ao MongoDB");
        }
        catch (err) {
            console.error("❌ Erro ao conectar ao MongoDB:", err.message);
            process.exit(1);
        }
        // 2) Criar instância do Express
        const app = (0, express_1.default)();
        // 3) Configurar CORS (front-end pode estar em outra porta/dominio)
        app.use((0, cors_1.default)({
            origin: "*",
            credentials: true,
        }));
        app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
            schema: typeDefs_1.schema,
            rootValue: resolvers_1.root,
            graphiql: true,
        }));
        app.get("/", (_req, res) => {
            res.send("API de Usuários (GraphQL via express-graphql) no ar! Acesse /graphql");
        });
        app.listen({ port: Number(PORT) }, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}/graphql`);
        });
    });
}
startServer().catch((err) => {
    console.error("Erro ao iniciar servidor:", err);
});
