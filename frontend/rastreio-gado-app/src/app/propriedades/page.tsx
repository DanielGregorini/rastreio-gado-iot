"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import Propriedade from "@/model/propriedade";

export default function PropriedadesPage() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novaPropriedade, setNovaPropriedade] = useState({
    nome: "",
    localizacao: ""
  });

  useEffect(() => {
    fetchPropriedades();
  }, []);

  async function fetchPropriedades() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propriedades?page=0&size=300`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getJwtToken()}`
        },
        credentials: "include"
      });

      if (!response.ok) throw new Error("Erro ao buscar propriedades");

      const data = await response.json();
      setPropriedades(data.content || []);
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriarPropriedade(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/propriedades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getJwtToken()}`
        },
        body: JSON.stringify({
          nome: novaPropriedade.nome,
          localizacao: novaPropriedade.localizacao,
          piquetes: [] 
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar propriedade");

      setNovaPropriedade({ nome: "", localizacao: "" });
      setMostrarFormulario(false);
      fetchPropriedades(); // atualiza lista
    } catch (error) {
      console.error("Erro ao criar propriedade:", error);
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
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-4">Lista de Propriedades</h1>

      <div className="text-center mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          {mostrarFormulario ? "Cancelar" : "Criar Propriedade"}
        </button>
      </div>

      {mostrarFormulario && (
        <form
          onSubmit={handleCriarPropriedade}
          className="max-w-md mx-auto bg-white p-6 rounded shadow-md mb-10"
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Nome:</label>
            <input
              type="text"
              value={novaPropriedade.nome}
              onChange={(e) =>
                setNovaPropriedade({ ...novaPropriedade, nome: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold mb-1">Localização:</label>
            <input
              type="text"
              value={novaPropriedade.localizacao}
              onChange={(e) =>
                setNovaPropriedade({
                  ...novaPropriedade,
                  localizacao: e.target.value
                })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Salvar
          </button>
        </form>
      )}

      {carregando ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : propriedades.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma propriedade encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {propriedades.map((propriedade) => (
            <Link href={`/propriedades/${propriedade.id}`} key={propriedade.id} className="block">
              <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold mb-2">{propriedade.nome}</h2>
                <p className="text-gray-600 mb-2">
                  📍 <strong>Localização:</strong> {propriedade.localizacao}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
