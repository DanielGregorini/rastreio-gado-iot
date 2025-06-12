"use client";
import React, { useState, useEffect } from "react";
import User from "@/model/user";
import UserCard from "@/components/user/userCard";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState<boolean>(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API_GRAPHQL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                users {
                  id
                  name
                  email
                  createdAt
                  updatedAt
                }
              }
            `,
          }),
        });

        const json = await response.json();
        if (json.errors) {
          throw new Error(JSON.stringify(json.errors));
        }

        setUsers(json.data.users);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    }

    fetchUsers();
  }, []);

  const onSubmitNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API_GRAPHQL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation CreateUser($input: CreateUserInput!) {
              createUser(input: $input) {
                id
                name
                email
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              name,
              email,
              password,
            },
          },
        }),
      });

      const json = await response.json();
      if (json.errors) {
        throw new Error(JSON.stringify(json.errors));
      }

      setUsers([...users, json.data.createUser]);
      setShowAddUser(false);
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mt-10">
        Página de Usuários
      </h1>

      <div className="flex justify-between items-start mt-8">
        <div className="w-1/12" />

        {/* Tabela centralizada */}
        <div className="w-10/12">
          {users.length === 0 ? (
            <p className="text-center text-gray-500">
              Nenhum usuário encontrado.
            </p>
          ) : (
            users.map((user: User) => <UserCard key={user.id} user={user} />)
          )}
        </div>

        <div className="w-1/12 flex justify-end">
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddUser ? "Fechar" : "Adicionar"}
          </button>
        </div>
      </div>

      {showAddUser && (
        <div className="max-w-md mx-auto mt-10">
          <form
            onSubmit={onSubmitNewUser}
            className="bg-white p-6 shadow rounded"
          >
            <div className="mb-4">
              <label className="block mb-2">Nome:</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Senha:</label>
              <input
                type="password"
                name="password"
                minLength={6}
                required
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Adicionar Usuário
            </button>
          </form>
        </div>
      )}
    </main>
  );
}
