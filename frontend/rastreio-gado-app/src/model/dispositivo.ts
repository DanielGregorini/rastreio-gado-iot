import Animal from "./animal";

export interface Dispositivo {
  id: number;
  identificador: string;
  tipo: string;
  ativo: boolean;
  animal: Animal;
  createdAt?: string;
  updatedAt?: string;
}
