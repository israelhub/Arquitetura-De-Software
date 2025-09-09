const { PrismaClient } = require('@prisma/client');
const AtorDataSource = require('./ator/AtorDataSource');
const FilmeDataSource = require('./filme/FilmeDataSource');
const GeneroDataSource = require('./genero/GeneroDataSource');

const prisma = new PrismaClient();

const createContext = () => {
  return {
    prisma,
    dataSources: {
      atorDataSource: new AtorDataSource(prisma),
      filmeDataSource: new FilmeDataSource(prisma),
      generoDataSource: new GeneroDataSource(prisma),
    },
  };
};

module.exports = createContext;
