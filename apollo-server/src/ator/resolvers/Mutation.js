const AtorService = require('../AtorService');

const Mutation = {
  criarAtor: async (_, { input }, { dataSources }) => {
    const atorService = new AtorService(dataSources.atorDataSource);
    return await atorService.create(input);
  },
  
  atualizarAtor: async (_, { id, input }, { dataSources }) => {
    const atorService = new AtorService(dataSources.atorDataSource);
    return await atorService.update(id, input);
  },
  
  excluirAtor: async (_, { id }, { dataSources }) => {
    const atorService = new AtorService(dataSources.atorDataSource);
    return await atorService.delete(id);
  },
};

module.exports = Mutation;
