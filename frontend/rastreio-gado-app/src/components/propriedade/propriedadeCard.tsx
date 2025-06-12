import React from "react";
import Link from "next/link";
import Propriedade from "@/model/propriedade";

interface PropriedadeCardProps {
  propriedade: Propriedade;
}

function PropriedadeCard({ propriedade }: PropriedadeCardProps) {
  return (
    <Link href={`/propriedades/${propriedade.id}`} className="block">
      <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{propriedade.nome}</h2>
        <p className="text-sm text-gray-600">
          🤡 <span className="font-medium">Id:</span> {propriedade.id}
        </p>
        <p className="text-sm text-gray-600">
          🤡 <span className="font-medium">Localizacao:</span> {propriedade.localizacao}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          🕒 <span className="font-medium">Criado em:</span>{" "}
          {new Date(propriedade.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
}

export default PropriedadeCard;
