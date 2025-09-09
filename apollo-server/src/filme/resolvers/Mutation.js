const FilmeService = require('../FilmeService');

const Mutation = {
  criarFilme: async (_, { input }, { dataSources }) => {
    const filmeService = new FilmeService(dataSources.filmeDataSource);
    return await filmeService.create(input);
  },
  
  atualizarFilme: async (_, { id, input }, { dataSources }) => {
    const filmeService = new FilmeService(dataSources.filmeDataSource);
    return await filmeService.update(id, input);
  },
  
  excluirFilme: async (_, { id }, { dataSources }) => {
    const filmeService = new FilmeService(dataSources.filmeDataSource);
    return await filmeService.delete(id);
  },

  adicionarAtoresEmFilme: async (_, { filmeId, atorIds }, { dataSources }) => {
    return await dataSources.filmeDataSource.addAtores(filmeId, atorIds);
  },

  removerAtorDeFilme: async (_, { filmeId, atorId }, { dataSources }) => {
    return await dataSources.filmeDataSource.removeAtor(filmeId, atorId);
  },

  adicionarGenerosEmFilme: async (_, { filmeId, generoIds }, { dataSources }) => {
    return await dataSources.filmeDataSource.addGeneros(filmeId, generoIds);
  },
};

module.exports = Mutation;
