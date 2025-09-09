const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const path = require('path');

// Schema base
const baseTypeDefs = `#graphql
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

// Carregar todos os arquivos .graphql da pasta types
const typesArray = loadFilesSync(path.join(__dirname, 'types'), {
  extensions: ['graphql']
});

// Combinar todos os typeDefs
const typeDefs = mergeTypeDefs([
  baseTypeDefs,
  ...typesArray
]);

module.exports = typeDefs;
