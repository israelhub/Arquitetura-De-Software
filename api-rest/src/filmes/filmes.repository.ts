import { Filme } from './entities/filme.entity';

export const filmes: Filme[] = [
  {
    id: 1,
    titulo: 'O Poderoso Chefão',
    anoLancamento: 1972,
    generoId: 1,
    atoresIds: [1, 2],
  },
  {
    id: 2,
    titulo: 'Scarface',
    anoLancamento: 1983,
    generoId: 1,
    atoresIds: [2],
  },
  {
    id: 3,
    titulo: 'Forrest Gump',
    anoLancamento: 1994,
    generoId: 2,
    atoresIds: [3],
  },
];
