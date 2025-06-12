import Piquete from "./piquete";

export default interface Animal {
  id: number;
  identificador: string;
  piquete: Piquete;
  createdAt?: string;
  updatedAt?: string;
}
