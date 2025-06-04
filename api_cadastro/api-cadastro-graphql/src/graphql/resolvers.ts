// src/graphql/resolvers.ts
import { UserModel, IUser } from "../model/user";
import { Types } from "mongoose";

interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
}

interface IUpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
}

export const root = {
  users: async (): Promise<Pick<IUser, "id" | "name" | "email" | "createdAt" | "updatedAt">[]> => {
    try {
      // .select("-password") faz com que a senha NÃO seja retornada
      const docs = await UserModel.find().select("-password").sort({ createdAt: -1 });
      // O Mongoose retorna Document, mas aqui tipamos como IUser sem password
      return docs.map((doc) => ({
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      }));
    } catch (err) {
      throw new Error("Erro ao buscar usuários: " + (err as Error).message);
    }
  },

  user: async (_args: any): Promise<Pick<IUser, "id" | "name" | "email" | "createdAt" | "updatedAt"> | null> => {
    const { id } = _args;
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    try {
      const doc = await UserModel.findById(id).select("-password");
      if (!doc) return null;
      return {
        id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      };
    } catch (err) {
      throw new Error("Erro ao buscar usuário: " + (err as Error).message);
    }
  },

  createUser: async (_args: any): Promise<Pick<IUser, "id" | "name" | "email" | "createdAt" | "updatedAt">> => {
    const { name, email, password } = _args.input as ICreateUserInput;

    // 1) Validar duplicidade de e-mail
    const existente = await UserModel.findOne({ email });
    if (existente) {
      throw new Error("Já existe usuário cadastrado com esse e-mail.");
    }

    // 2) Criar e salvar (o hook pre("save") irá criptografar a senha)
    const novo = new UserModel({ name, email, password });
    try {
      const userSalvo = await novo.save();
      return {
        id: userSalvo._id.toString(),
        name: userSalvo.name,
        email: userSalvo.email,
        createdAt: userSalvo.createdAt.toISOString(),
        updatedAt: userSalvo.updatedAt.toISOString(),
      };
    } catch (err) {
      throw new Error("Erro ao criar usuário: " + (err as Error).message);
    }
  },

  updateUser: async (_args: any): Promise<Pick<IUser, "id" | "name" | "email" | "createdAt" | "updatedAt">> => {
    const { id, name, email, password } = _args.input as IUpdateUserInput;

    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido para atualização.");
    }

    if (email !== undefined) {
      const outro = await UserModel.findOne({ email, _id: { $ne: id } });
      if (outro) {
        throw new Error("Já existe outro usuário com esse e-mail.");
      }
    }

    const camposParaAtualizar: Partial<Pick<IUser, "name" | "email" | "password">> = {};
    if (name !== undefined) camposParaAtualizar.name = name;
    if (email !== undefined) camposParaAtualizar.email = email;
    if (password !== undefined) camposParaAtualizar.password = password;

    try {
      if (password !== undefined) {
        const userExistente = await UserModel.findById(id);
        if (!userExistente) {
          throw new Error("Usuário não encontrado para atualizar.");
        }
        if (name !== undefined) userExistente.name = name;
        if (email !== undefined) userExistente.email = email;
        userExistente.password = password; // isso aciona o hook pre("save")
        const atualizado = await userExistente.save();
        return {
          id: atualizado._id.toString(),
          name: atualizado.name,
          email: atualizado.email,
          createdAt: atualizado.createdAt.toISOString(),
          updatedAt: atualizado.updatedAt.toISOString(),
        };
      }

      const atualizado = await UserModel.findByIdAndUpdate(
        id,
        { $set: camposParaAtualizar },
        { new: true, runValidators: true }
      ).select("-password");

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
    } catch (err) {
      throw new Error("Erro ao atualizar usuário: " + (err as Error).message);
    }
  },

  deleteUser: async (_args: any): Promise<boolean> => {
    const { id } = _args;
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }
    try {
      const resultado = await UserModel.findByIdAndDelete(id);
      return resultado !== null;
    } catch (err) {
      throw new Error("Erro ao deletar usuário: " + (err as Error).message);
    }
  },
};
