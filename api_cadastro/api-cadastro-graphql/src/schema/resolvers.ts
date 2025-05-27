type Livro = {
  id: string;
  titulo: string;
  autor: string;
  ano?: number;
};

let livros: Livro[] = [];

export const resolvers = {
  Query: {
    livros: () => livros,
    livro: (_: any, { id }: { id: string }) => livros.find(l => l.id === id),
  },
  Mutation: {
    criarLivro: (_: any, args: Omit<Livro, 'id'>) => {
      const novoLivro = { id: crypto.randomUUID(), ...args };
      livros.push(novoLivro);
      return novoLivro;
    },
    atualizarLivro: (_: any, args: Livro) => {
      const index = livros.findIndex(l => l.id === args.id);
      if (index === -1) return null;
      livros[index] = { ...livros[index], ...args };
      return livros[index];
    },
    deletarLivro: (_: any, { id }: { id: string }) => {
      const index = livros.findIndex(l => l.id === id);
      if (index === -1) return null;
      const [removido] = livros.splice(index, 1);
      return removido;
    },
  },
};
