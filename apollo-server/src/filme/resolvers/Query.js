const Query = {
  filmes: async (_, __, { dataSources }) => {
    return await dataSources.filmeDataSource.findAll();
  },
  
  filme: async (_, { id }, { dataSources }) => {
    return await dataSources.filmeDataSource.findById(id);
  },
};

module.exports = Query;
