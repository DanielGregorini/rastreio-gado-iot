"use client"
import React, { useState, useEffect } from 'react'

import Propriedade from '@/model/propriedade'
import Piquete from '@/model/piquete'
import AnimaisListByPiquete from '../animais/animaisListByPiquete'

interface PiquetesListByPropriedadeProps {
  propriedade: Propriedade
}

export default function PiquetesListByPropriedade({ propriedade }: PiquetesListByPropriedadeProps) {
  const [piquetes, setPiquetes] = useState<Piquete[]>([])

  async function fetchPiquetesByPropriedade(propriedadeId: number) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_API}/propriedades/${propriedadeId}/piquetes?page=0&size=300`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        }
      )
      if (!response.ok) throw new Error('Erro ao buscar piquetes')
      const data: Piquete[] = await response.json()
      setPiquetes(data)
    } catch (error) {
      console.error('Erro ao carregar piquetes:', error)
      setPiquetes([])
    }
  }

  useEffect(() => {
    if (propriedade?.id) {
      fetchPiquetesByPropriedade(propriedade.id)
    }
  }, [propriedade])

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">
        Piquetes da Propriedade: {propriedade.nome} (ID: {propriedade.id})
      </h2>

      {piquetes.length > 0 ? (
        <ul className="space-y-4">
          {piquetes.map(p => (
            <li
              key={p.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="mb-2 font-medium">
                {p.id} – {p.nome}
              </div>
              <AnimaisListByPiquete piquete={p} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 p-4">
          Não há piquetes cadastrados para esta propriedade.
        </div>
      )}
    </div>
  )
}
