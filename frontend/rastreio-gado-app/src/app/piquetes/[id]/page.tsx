"use client";
import React, { use, useEffect, useState } from "react";
import Piquete from "@/model/piquete";

export default function PiquetePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [piquete, setPiquete] = useState<Piquete | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<{ nome: string }>({ nome: "" });

  useEffect(() => {
    async function fetchPiquete() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/piquetes/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getJwtToken()}`
          },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Piquete não encontrada");

        const data = await response.json();
        setPiquete(data);
        setFormData({ nome: data.nome });
      } catch (error) {
        console.error("Erro ao buscar piquete:", error);
        setPiquete(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPiquete();
  }, [id]);

 async function handleUpdatePiquete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/piquetes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getJwtToken()}`
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erro ao atualizar");

      const updated = await response.json();
      setPiquete(updated);
      setEditMode(false);
    } catch (error) {
      console.error("Erro ao atualizar piquete:", error);
    }
  }

  function getJwtToken() {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )jwt=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
    return "";
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mt-8">Detalhes do Piquete</h1>

      {loading ? (
        <p className="text-center mt-6 text-gray-500">Carregando...</p>
      ) : piquete ? (
        <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded shadow">
          {editMode ? (
            <form onSubmit={handleUpdatePiquete}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <p><strong>ID:</strong> {piquete.id}</p>
              <p><strong>Nome:</strong> {piquete.nome}</p>

              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Editar
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="text-center mt-10 text-red-500">Piquete não encontrada.</p>
      )}
    </main>
  );
}
