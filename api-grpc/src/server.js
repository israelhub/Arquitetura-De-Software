const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Importar DataSources
const FilmeDataSource = require('./filme/datasource');
const AtorDataSource = require('./ator/datasource');
const GeneroDataSource = require('./genero/datasource');

// Importar Services
const FilmeService = require('./filme/service');
const AtorService = require('./ator/service');
const GeneroService = require('./genero/service');

// Importar Implementations
const FilmeImplementation = require('./filme/implementation');
const AtorImplementation = require('./ator/implementation');
const GeneroImplementation = require('./genero/implementation');

// Carregar o arquivo proto
const PROTO_PATH = path.join(__dirname, '../proto/cinema.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});

const cinemaProto = grpc.loadPackageDefinition(packageDefinition).cinema;

// Inicializar DataSources
const filmeDataSource = new FilmeDataSource();
const atorDataSource = new AtorDataSource();
const generoDataSource = new GeneroDataSource();

// Inicializar Services
const filmeService = new FilmeService(filmeDataSource, atorDataSource, generoDataSource);
const atorService = new AtorService(atorDataSource);
const generoService = new GeneroService(generoDataSource);

// Inicializar Implementations
const filmeImplementation = new FilmeImplementation(filmeService);
const atorImplementation = new AtorImplementation(atorService);
const generoImplementation = new GeneroImplementation(generoService);

// Criar servidor gRPC
const server = new grpc.Server();

// Adicionar serviços
server.addService(cinemaProto.FilmeService.service, {
  listFilmes: filmeImplementation.listFilmes.bind(filmeImplementation),
  getFilme: filmeImplementation.getFilme.bind(filmeImplementation),
  createFilme: filmeImplementation.createFilme.bind(filmeImplementation),
  updateFilme: filmeImplementation.updateFilme.bind(filmeImplementation),
  deleteFilme: filmeImplementation.deleteFilme.bind(filmeImplementation),
  getFilmeAtores: filmeImplementation.getFilmeAtores.bind(filmeImplementation),
  addAtorToFilme: filmeImplementation.addAtorToFilme.bind(filmeImplementation)
});

server.addService(cinemaProto.AtorService.service, {
  listAtores: atorImplementation.listAtores.bind(atorImplementation),
  getAtor: atorImplementation.getAtor.bind(atorImplementation),
  createAtor: atorImplementation.createAtor.bind(atorImplementation),
  updateAtor: atorImplementation.updateAtor.bind(atorImplementation),
  deleteAtor: atorImplementation.deleteAtor.bind(atorImplementation)
});

server.addService(cinemaProto.GeneroService.service, {
  listGeneros: generoImplementation.listGeneros.bind(generoImplementation),
  getGenero: generoImplementation.getGenero.bind(generoImplementation),
  createGenero: generoImplementation.createGenero.bind(generoImplementation),
  updateGenero: generoImplementation.updateGenero.bind(generoImplementation),
  deleteGenero: generoImplementation.deleteGenero.bind(generoImplementation)
});

// Configurar bind e iniciar servidor
const PORT = process.env.PORT || 50051;
const HOST = 'localhost';

server.bindAsync(
  `${HOST}:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error('Erro ao iniciar servidor:', error);
      return;
    }
    
    console.log(`Servidor gRPC iniciado na porta ${port}`);
  }
);
