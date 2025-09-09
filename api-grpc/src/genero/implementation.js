class GeneroImplementation {
  constructor(generoService) {
    this.generoService = generoService;
  }

  async listGeneros(call, callback) {
    try {
      const generos = this.generoService.listGeneros();
      callback(null, { generos });
    } catch (error) {
      callback({
        code: 13, // INTERNAL
        details: error.message
      });
    }
  }

  async getGenero(call, callback) {
    try {
      const { id } = call.request;
      const genero = this.generoService.getGenero(id);
      callback(null, genero);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }

  async createGenero(call, callback) {
    try {
      const generoData = call.request;
      const genero = this.generoService.createGenero(generoData);
      callback(null, genero);
    } catch (error) {
      callback({
        code: 3, // INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async updateGenero(call, callback) {
    try {
      const { id, ...generoData } = call.request;
      const genero = this.generoService.updateGenero(id, generoData);
      callback(null, genero);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 3, // NOT_FOUND : INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async deleteGenero(call, callback) {
    try {
      const { id } = call.request;
      const success = this.generoService.deleteGenero(id);
      callback(null, { 
        success, 
        message: success ? 'Gênero deletado com sucesso' : 'Erro ao deletar gênero' 
      });
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }
}

module.exports = GeneroImplementation;
