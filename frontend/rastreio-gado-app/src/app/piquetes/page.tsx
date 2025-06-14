"use client";
import React, { useEffect, useState } from "react";
import Piquete from "@/model/piquete";
import Link from "next/link";

export default function PiquetesPage() {
  const [piquetes, setPiquetes] = useState<Piquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    propriedadeId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPiquetes();
  }, []);

  async function fetchPiquetes() {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/piquetes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJwtToken()}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Erro ao buscar piquetes");
      const json = await response.json();
      setPiquetes(json.content || []);
    } catch (error) {
      console.error("Erro ao carregar piquetes:", error);
      setPiquetes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/piquetes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJwtToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({
            nome: formData.nome,
            propriedadeId: parseInt(formData.propriedadeId),
          }),
        }
      );

      if (!response.ok) throw new Error("Erro ao adicionar piquete");

      setFormData({ nome: "", propriedadeId: "" });
      setShowForm(false);
      await fetchPiquetes();
    } catch (error) {
      console.error("Erro ao adicionar piquete:", error);
    } finally {
      setSubmitting(false);
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
      <h1 className="text-2xl font-bold text-center mt-10">
        Página de Piquetes
      </h1>
      <p className="text-center mt-4 text-gray-600">
        Aqui você pode visualizar e gerenciar os Piquetes cadastrados.
      </p>

      <div className="text-center mt-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {showForm ? "Cancelar" : "Adicionar Piquete"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white max-w-md mx-auto mt-6 p-6 rounded shadow"
        >
          <div className="mb-4">
            <label className="block font-semibold mb-1">Nome do Piquete</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) =>
                setFormData({ ...formData, nome: e.target.value })
              }
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-1">
              ID da Propriedade
            </label>
            <input
              type="number"
              value={formData.propriedadeId}
              onChange={(e) =>
                setFormData({ ...formData, propriedadeId: e.target.value })
              }
              required
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {submitting ? "Salvando..." : "Salvar"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-8">Carregando...</p>
      ) : piquetes.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">Nenhum piquete encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-10">
          {piquetes.map((p) => (
            <Link href={`/piquetes/${p.id}`} key={p.id} className="block">
              <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg">
                <h2 className="text-xl font-semibold">{p.nome}</h2>
                <p className="text-gray-600 mt-2">Id: {p.id}</p>
                {p.propriedade && (
                  <p className="text-gray-600 mt-1">
                    <strong>Propriedade:</strong> {p.propriedade.nome}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
