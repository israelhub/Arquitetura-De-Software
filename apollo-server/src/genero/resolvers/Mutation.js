const GeneroService = require('../GeneroService');

const Mutation = {
  criarGenero: async (_, { input }, { dataSources }) => {
    const generoService = new GeneroService(dataSources.generoDataSource);
    return await generoService.create(input);
  },
  
  atualizarGenero: async (_, { id, input }, { dataSources }) => {
    const generoService = new GeneroService(dataSources.generoDataSource);
    return await generoService.update(id, input);
  },
  
  excluirGenero: async (_, { id }, { dataSources }) => {
    const generoService = new GeneroService(dataSources.generoDataSource);
    return await generoService.delete(id);
  },
};

module.exports = Mutation;
