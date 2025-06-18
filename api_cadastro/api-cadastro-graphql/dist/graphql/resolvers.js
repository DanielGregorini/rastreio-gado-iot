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
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = void 0;
// src/graphql/resolvers.ts
const user_1 = require("../model/user");
const mongoose_1 = require("mongoose");
exports.root = {
    users: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // .select("-password") faz com que a senha NÃO seja retornada
            const docs = yield user_1.UserModel.find().select("-password").sort({ createdAt: -1 });
            // O Mongoose retorna Document, mas aqui tipamos como IUser sem password
            return docs.map((doc) => ({
                id: doc._id.toString(),
                name: doc.name,
                email: doc.email,
                createdAt: doc.createdAt.toISOString(),
                updatedAt: doc.updatedAt.toISOString(),
            }));
        }
        catch (err) {
            throw new Error("Erro ao buscar usuários: " + err.message);
        }
    }),
    user: (_args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = _args;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return null;
        }
        try {
            const doc = yield user_1.UserModel.findById(id).select("-password");
            if (!doc)
                return null;
            return {
                id: doc._id.toString(),
                name: doc.name,
                email: doc.email,
                createdAt: doc.createdAt.toISOString(),
                updatedAt: doc.updatedAt.toISOString(),
            };
        }
        catch (err) {
            throw new Error("Erro ao buscar usuário: " + err.message);
        }
    }),
    createUser: (_args) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = _args.input;
        // 1) Validar duplicidade de e-mail
        const existente = yield user_1.UserModel.findOne({ email });
        if (existente) {
            throw new Error("Já existe usuário cadastrado com esse e-mail.");
        }
        // 2) Criar e salvar (o hook pre("save") irá criptografar a senha)
        const novo = new user_1.UserModel({ name, email, password });
        try {
            const userSalvo = yield novo.save();
            return {
                id: userSalvo._id.toString(),
                name: userSalvo.name,
                email: userSalvo.email,
                createdAt: userSalvo.createdAt.toISOString(),
                updatedAt: userSalvo.updatedAt.toISOString(),
            };
        }
        catch (err) {
            throw new Error("Erro ao criar usuário: " + err.message);
        }
    }),
    updateUser: (_args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, name, email, password } = _args.input;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new Error("ID inválido para atualização.");
        }
        if (email !== undefined) {
            const outro = yield user_1.UserModel.findOne({ email, _id: { $ne: id } });
            if (outro) {
                throw new Error("Já existe outro usuário com esse e-mail.");
            }
        }
        const camposParaAtualizar = {};
        if (name !== undefined)
            camposParaAtualizar.name = name;
        if (email !== undefined)
            camposParaAtualizar.email = email;
        if (password !== undefined)
            camposParaAtualizar.password = password;
        try {
            if (password !== undefined) {
                const userExistente = yield user_1.UserModel.findById(id);
                if (!userExistente) {
                    throw new Error("Usuário não encontrado para atualizar.");
                }
                if (name !== undefined)
                    userExistente.name = name;
                if (email !== undefined)
                    userExistente.email = email;
                userExistente.password = password; // isso aciona o hook pre("save")
                const atualizado = yield userExistente.save();
                return {
                    id: atualizado._id.toString(),
                    name: atualizado.name,
                    email: atualizado.email,
                    createdAt: atualizado.createdAt.toISOString(),
                    updatedAt: atualizado.updatedAt.toISOString(),
                };
            }
            const atualizado = yield user_1.UserModel.findByIdAndUpdate(id, { $set: camposParaAtualizar }, { new: true, runValidators: true }).select("-password");
            if (!atualizado) {
                throw new Error("Usuário não encontrado para atualizar.");
            }
            return {
                id: atualizado._id.toString(),
                name: atualizado.name,
                email: atualizado.email,
                createdAt: atualizado.createdAt.toISOString(),
                updatedAt: atualizado.updatedAt.toISOString(),
            };
        }
        catch (err) {
            throw new Error("Erro ao atualizar usuário: " + err.message);
        }
    }),
    deleteUser: (_args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = _args;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            return false;
        }
        try {
            const resultado = yield user_1.UserModel.findByIdAndDelete(id);
            return resultado !== null;
        }
        catch (err) {
            throw new Error("Erro ao deletar usuário: " + err.message);
        }
    }),
};
