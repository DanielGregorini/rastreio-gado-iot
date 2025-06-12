"use client";
import React, { useEffect, useState } from "react";
import Piquete from "@/model/piquete"; // certifique-se de que o model esteja correto

export default function PiquetesPage() {
  const [piquetes, setPiquetes] = useState<Piquete[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPiquetes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/piquetes`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getJwtToken()}`
          },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Erro ao buscar piquetes");
        console.log("Response status:", response);

        const json = await response.json();

        console.log("Piquetes data:", json);
        setPiquetes(json.content || []);
      } catch (error) {
        console.error("Erro ao carregar piquetes:", error);
        setPiquetes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPiquetes();
  }, []);

  function getJwtToken() {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|; )jwt=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : "";
    }
    return "";
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mt-10">Página de Piquetes</h1>
      <p className="text-center mt-4 mb-6 text-gray-600">
        Aqui você pode visualizar e gerenciar os Piquetes cadastrados.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Carregando...</p>
      ) : piquetes.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum piquete encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {piquetes.map((p) => (
            <div key={p.id} className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold">{p.nome}</h2>
              <p className="text-gray-600 mt-2">
                
              </p>
              {p.propriedade && (
                <p className="text-gray-600 mt-1">
                  <strong>Propriedade:</strong> {p.propriedade.nome}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
