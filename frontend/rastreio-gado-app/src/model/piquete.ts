import Propriedade from "./propriedade";
import Animal from "./animal";

export default interface Piquete {
  id: number;
  nome: string;
  propriedade: Propriedade;
  animal: Animal[];
  createdAt?: string;
  updatedAt?: string;
}
