"use client";
import React, { useEffect, useState } from "react";
import User from "@/model/user";
import { use } from "react";

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API_GRAPHQL}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
              query GetUserById($id: ID!) {
                user(id: $id) {
                  id
                  name
                  email
                  createdAt
                  updatedAt
                }
              }
            `,
              variables: { id },
            }),
          }
        );

        const json = await response.json();
        if (json.errors) throw new Error(JSON.stringify(json.errors));

        setUser(json.data.user);
        setForm({ name: json.data.user.name, email: json.data.user.email });
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    fetchUser();
  }, [id]);

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API_GRAPHQL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
    mutation UpdateUser($input: UpdateUserInput!) {
      updateUser(input: $input) {
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
                id, // <- id vai dentro do input agora
                name: form.name,
                email: form.email,
              },
            },
          }),
        }
      );

      const json = await response.json();
      if (json.errors) throw new Error(JSON.stringify(json.errors));

      setUser(json.data.updateUser);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mt-10">
        Detalhes do Usuário
      </h1>

      {user ? (
        <div className="max-w-md mx-auto mt-6 bg-white p-6 shadow rounded">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Criado em:</strong> {user.createdAt.toLocaleString()}
          </p>
          <p>
            <strong>Atualizado em:</strong> {user.updatedAt?.toLocaleString()}
          </p>

          {!editMode ? (
            <>
              <p>
                <strong>Nome:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setEditMode(true)}
              >
                Editar Usuário
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdateUser} className="mt-4">
              <div className="mb-4">
                <label className="block mb-1">Nome:</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">Carregando usuário...</p>
      )}
    </main>
  );
}
