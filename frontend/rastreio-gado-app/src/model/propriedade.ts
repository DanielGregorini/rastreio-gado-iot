import Piquete from "./piquete";

interface Propriedade {
  id: number;
  nome: string;
  localizacao: string;
  createdAt: Date;
  updatedAt?: Date;
  piquete?: Piquete[];
}
export default Propriedade;