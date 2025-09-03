export const filmes: any[] = [
  { id: '1', titulo: 'Filme A', ano: 2020, atoresIds: ['1'], generosIds: ['1'] },
  { id: '2', titulo: 'Filme B', ano: 2021, atoresIds: ['1','2'], generosIds: ['2'] },
];

export const atores: any[] = [
  { id: '1', nome: 'Ator Um', dataNascimento: '1990-01-01', filmesIds: ['1','2'] },
  { id: '2', nome: 'Ator Dois', dataNascimento: '1985-05-10', filmesIds: ['2'] },
];

export const generos: any[] = [
  { id: '1', nome: 'Ação', filmesIds: ['1'] },
  { id: '2', nome: 'Comédia', filmesIds: ['2'] },
];
