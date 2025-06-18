"use client"
import React, { useState, useEffect } from 'react'
import Animal from '@/model/animal'
import Piquete from '@/model/piquete'

interface AnimaisListByPiqueteProps {
  piquete: Piquete
}

export default function AnimaisListByPiquete({ piquete }: AnimaisListByPiqueteProps) {
  const [animais, setAnimais] = useState<Animal[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnimais() {
      setLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_API}/piquetes/${piquete.id}/animais`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          }
        )
        if (!response.ok) {
          throw new Error('Erro ao buscar animais')
        }
        const data: Animal[] = await response.json()
        setAnimais(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    if (piquete && piquete.id) {
      fetchAnimais()
    }
  }, [piquete])

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">
        Animais no Piquete: {piquete.nome} (ID: {piquete.id})
      </h3>

      {loading && (
        <div className="text-center text-gray-500">Carregando...</div>
      )}

      {error && (
        <div className="text-center text-red-500">{error}</div>
      )}

      {!loading && !error && (
        animais.length > 0 ? (
          <ul className="space-y-2">
            {animais.map(a => (
              <li
                key={a.id}
                className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="font-medium">{a.id} – {a.identificador}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500 p-4">
            Nenhum animal cadastrado neste piquete.
          </div>
        )
      )}
    </div>
  )
}