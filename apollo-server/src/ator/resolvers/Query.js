const Query = {
  atores: async (_, __, { dataSources }) => {
    return await dataSources.atorDataSource.findAll();
  },
  
  ator: async (_, { id }, { dataSources }) => {
    return await dataSources.atorDataSource.findById(id);
  },
};

module.exports = Query;
