"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

import Propriedade from "@/model/propriedade";

export default function PropriedadesPage() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchPropriedades() {
      try {
        const response = await fetch("http://localhost:8080/propriedades", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getJwtToken()}`
          },
          credentials: "include"
        });

        if (!response.ok) throw new Error("Erro ao buscar propriedades");

        const data = await response.json();

        console.log("Propriedades recebidas:", data);
        setPropriedades(data.content || []); // Ajuste para lidar com a estrutura de dados retornada
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
      } finally {
        setCarregando(false);
      }
    }

    fetchPropriedades();
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
      <h1 className="text-2xl font-bold text-center mb-8">Lista de Propriedades</h1>

      {carregando ? (
        <p className="text-center text-gray-600">Carregando...</p>
      ) : propriedades.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma propriedade encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {propriedades.map((propriedade) => (
            <Link href={`/propriedades/${propriedade.id}`} key={propriedade.id} className="block">
            <div
              key={propriedade.id}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-2">{propriedade.nome}</h2>
              <p className="text-gray-600 mb-2">
                📍 <strong>Localização:</strong> {propriedade.localizacao}
              </p>
              <div>
                <p className="font-medium mb-1">📋 Piquetes:</p>
                <ul className="list-disc list-inside text-gray-700">
                  {/* Piquetes podem ser renderizados aqui */}
                </ul>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
