const Query = {
  generos: async (_, __, { dataSources }) => {
    return await dataSources.generoDataSource.findAll();
  },
  
  genero: async (_, { id }, { dataSources }) => {
    return await dataSources.generoDataSource.findById(id);
  },
};

module.exports = Query;
