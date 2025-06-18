"use client";
import React, { useState, useEffect } from "react";

import Propriedade from "@/model/propriedade";
import SelectPropriedade from "@/components/propriedade/selectPropriedade";
import PiquetesListByPropriedade from "@/components/piquetes/piquetesListByPropriedade";

export default function LocalizacoesPage() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [propriedadeSelecionada, setPropriedadeSelecionada] = useState<
    Propriedade | undefined
  >(undefined);

  async function fetchPropriedades() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/piquetes?page=0&size=300`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) throw new Error("Erro ao buscar propriedades");

      const data = await response.json();

      console.log("Propriedades carregadas:", data.content);
      setPropriedades(data.content || []);
      setPropriedadeSelecionada(data.content[0]);
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
    }
  }

  useEffect(() => {
    fetchPropriedades();
  }, []);

  return (
    <main className="min-h-screen">
      <div className="flex w-full justify-center items-center p-4 text-2">
        <SelectPropriedade
          propriedades={propriedades}
          onChange={setPropriedadeSelecionada}
          propriedadeSelecionada={propriedadeSelecionada}
        />
      </div>

      <div className="flex w-full justify-center items-center p-4 text-2">
        {propriedadeSelecionada && (
          <PiquetesListByPropriedade propriedade={propriedadeSelecionada} />
        )}
      </div>

      {propriedadeSelecionada && (
        <div className="flex flex-col items-center p-4">
          Propriedade Selecionada: {propriedadeSelecionada.nome}
        </div>
      )}
    </main>
  );
}
