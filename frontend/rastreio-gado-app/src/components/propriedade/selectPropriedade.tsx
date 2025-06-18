import React from 'react'
import Propriedade from '@/model/propriedade'

interface SelectPropriedadeProps {
  propriedades: Propriedade[]
  onChange: (propriedade: Propriedade) => void
  propriedadeSelecionada?: Propriedade
}

export default function SelectPropriedade({ propriedades, onChange, propriedadeSelecionada }: SelectPropriedadeProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value, 10)
    const selected = propriedades.find(p => p.id === id)
    if (selected) {
      onChange(selected)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <label htmlFor="select-propriedade" className="block mb-1 text-2xl text-gray-700">
        Propriedade
      </label>
      <select
        id="select-propriedade"
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={propriedadeSelecionada?.id ?? ''}
        onChange={handleChange}
      >
        <option value="" disabled>
          Selecione uma propriedade
        </option>
        {propriedades.map(p => (
          <option key={p.id} value={p.id}>
            {p.id} – {p.nome}
          </option>
        ))}
      </select>
    </div>
  )
}
