const QueryAtor = require('./ator/resolvers/Query');
const MutationAtor = require('./ator/resolvers/Mutation');

const QueryFilme = require('./filme/resolvers/Query');
const MutationFilme = require('./filme/resolvers/Mutation');

const QueryGenero = require('./genero/resolvers/Query');
const MutationGenero = require('./genero/resolvers/Mutation');

const resolvers = {
  Query: {
    ...QueryAtor,
    ...QueryFilme,
    ...QueryGenero,
  },
  
  Mutation: {
    ...MutationAtor,
    ...MutationFilme,
    ...MutationGenero,
  },
  
  // Field resolvers
  Ator: {
    filmes: async (ator, _, { dataSources }) => {
      return await dataSources.atorDataSource.getFilmes(ator.id);
    },
  },

  Filme: {
    atores: async (filme, _, { dataSources }) => {
      const filmeComAtores = await dataSources.filmeDataSource.findById(filme.id);
      return filmeComAtores?.atores.map(a => a.ator) || [];
    },
    generos: async (filme, _, { dataSources }) => {
      const filmeComGeneros = await dataSources.filmeDataSource.findById(filme.id);
      return filmeComGeneros?.generos.map(g => g.genero) || [];
    },
  },

  Genero: {
    filmes: async (genero, _, { dataSources }) => {
      return await dataSources.generoDataSource.getFilmes(genero.id);
    },
  },
};

module.exports = resolvers;
