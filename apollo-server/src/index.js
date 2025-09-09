const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Importar typeDefs
const typeDefs = require('../schema/typeDefs');

// Importar resolvers
const resolvers = require('./resolvers');

// Importar context
const createContext = require('./context');

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => createContext(),
  });

  console.log(`🚀 Servidor GraphQL rodando em ${url}`);
  console.log(`📊 Prisma Studio rodando em http://localhost:5555`);
}

startServer().catch(error => {
  console.error('Erro ao iniciar o servidor:', error);
});