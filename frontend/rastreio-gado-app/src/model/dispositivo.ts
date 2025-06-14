import Animal from "./animal";

export default interface Dispositivo {
  id: number;
  identificador: string;
  tipo: string;
  ativo: boolean;
  animal: Animal;
  createdAt?: string;
  updatedAt?: string;
}
