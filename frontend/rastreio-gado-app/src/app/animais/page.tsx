"use client";
import React, { useEffect, useState } from "react";
import Animal from "@/model/animal";
import Piquete from "@/model/piquete";
import Dispositivo from "@/model/dispositivo";

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [piquetesUnicos, setPiquetesUnicos] = useState<Piquete[]>([]);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);

  // Para controlar mini‐form de novo dispositivo por animal
  const [novoDispByAnimal, setNovoDispByAnimal] = useState<{
    [animalId: number]: { identificador: string; tipo: string };
  }>({});

  // Para controlar mini‐form de novo animal por piquete
  const [novoAnimalByPiquete, setNovoAnimalByPiquete] = useState<{
    [piqueteId: number]: string;
  }>({});

  useEffect(() => {
    async function fetchDados() {
      try {
        // Animais
        const respAnimais = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais?page=0&size=300`, );
        const dataAnimais = await respAnimais.json();
        setAnimais(dataAnimais.content || []);

        // Piquetes
        const respPiquetes = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/piquetes?page=0&size=300`, );
        const dataPiquetes = await respPiquetes.json();
        setPiquetesUnicos(dataPiquetes.content || []);

        // Dispositivos
        const respDisps = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dispositivos?page=0&size=300`, );
        const dataDisps = await respDisps.json();
        setDispositivos(dataDisps.content || []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }
    fetchDados();
  }, []);

  // Excluir animal
  async function handleExcluirAnimal(id: number) {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Falha ao excluir animal");
      setAnimais(animais.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // Criar novo animal em um piquete específico
  async function handleCriarAnimal(
    e: React.FormEvent,
    piqueteId: number
  ) {
    e.preventDefault();
    const identificador = novoAnimalByPiquete[piqueteId];
    if (!identificador) return;
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/animais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador, piqueteId }),
      });
      if (!resp.ok) throw new Error("Falha ao criar animal");
      const criado: Animal = await resp.json();
      setAnimais([...animais, criado]);
      setNovoAnimalByPiquete((prev) => ({ ...prev, [piqueteId]: "" }));
    } catch (err) {
      console.error(err);
    }
  }

  // Excluir dispositivo
  async function handleExcluirDispositivo(id: number) {
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dispositivos/${id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Falha ao excluir dispositivo");
      setDispositivos(dispositivos.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  // Criar novo dispositivo para um animal
  async function handleCriarDispositivo(animalId: number) {
    try {
      const { identificador, tipo } = novoDispByAnimal[animalId] || {};
      const resp = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/dispositivos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador, tipo, ativo: true, animalId }),
      });
      if (!resp.ok) throw new Error("Falha ao criar dispositivo");
      const criado: Dispositivo = await resp.json();
      setDispositivos([...dispositivos, criado]);
      setNovoDispByAnimal((prev) => {
        const o = { ...prev };
        delete o[animalId];
        return o;
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-8">
        Animais Cadastrados
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {piquetesUnicos.map((piquete) => (
          <div key={piquete.id}>
            <h2 className="text-xl font-semibold mb-2">
              📍 {piquete.nome}
            </h2>

            {/* Lista de animais */}
            <ul className="bg-white rounded p-4 shadow space-y-4">
              {animais
                .filter((a) => a.piquete?.id === piquete.id)
                .map((animal) => {
                  const disp = dispositivos.find(
                    (d) => d.animal.id === animal.id
                  );
                  return (
                    <li
                      key={animal.id}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium">
                          {animal.identificador}
                        </span>
                        {disp && (
                          <span className="ml-4 text-sm text-gray-700">
                            📟 {disp.identificador} ({disp.tipo})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* botão excluir animal */}
                        <button
                          onClick={() => handleExcluirAnimal(animal.id)}
                          className="text-red-600 hover:underline"
                        >
                          🗑️ Animal
                        </button>

                        {/* dispositivo */}
                        {disp ? (
                          <button
                            onClick={() =>
                              handleExcluirDispositivo(disp.id)
                            }
                            className="text-red-600 hover:underline"
                          >
                            🗑️ Disp.
                          </button>
                        ) : (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="ID Disp."
                              value={
                                novoDispByAnimal[animal.id]?.identificador ||
                                ""
                              }
                              onChange={(e) =>
                                setNovoDispByAnimal((prev) => ({
                                  ...prev,
                                  [animal.id]: {
                                    ...(prev[animal.id] || {
                                      tipo: "",
                                      identificador: "",
                                    }),
                                    identificador: e.target.value,
                                  },
                                }))
                              }
                              className="border p-1 rounded w-24"
                            />
                            <input
                              type="text"
                              placeholder="Tipo"
                              value={novoDispByAnimal[animal.id]?.tipo || ""}
                              onChange={(e) =>
                                setNovoDispByAnimal((prev) => ({
                                  ...prev,
                                  [animal.id]: {
                                    ...(prev[animal.id] || {
                                      tipo: "",
                                      identificador: "",
                                    }),
                                    tipo: e.target.value,
                                  },
                                }))
                              }
                              className="border p-1 rounded w-20"
                            />
                            <button
                              onClick={() => handleCriarDispositivo(animal.id)}
                              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            >
                              + Disp.
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
            </ul>

            {/* mini‐form para adicionar animal */}
            <form
              onSubmit={(e) => handleCriarAnimal(e, piquete.id)}
              className="mt-4 flex space-x-2"
            >
              <input
                type="text"
                placeholder="Novo animal"
                value={novoAnimalByPiquete[piquete.id] || ""}
                onChange={(e) =>
                  setNovoAnimalByPiquete((prev) => ({
                    ...prev,
                    [piquete.id]: e.target.value,
                  }))
                }
                className="border p-2 rounded flex-1"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Animal
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
