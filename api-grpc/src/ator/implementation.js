class AtorImplementation {
  constructor(atorService) {
    this.atorService = atorService;
  }

  async listAtores(call, callback) {
    try {
      const atores = this.atorService.listAtores();
      callback(null, { atores });
    } catch (error) {
      callback({
        code: 13, // INTERNAL
        details: error.message
      });
    }
  }

  async getAtor(call, callback) {
    try {
      const { id } = call.request;
      const ator = this.atorService.getAtor(id);
      callback(null, ator);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }

  async createAtor(call, callback) {
    try {
      const atorData = call.request;
      const ator = this.atorService.createAtor(atorData);
      callback(null, ator);
    } catch (error) {
      callback({
        code: 3, // INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async updateAtor(call, callback) {
    try {
      const { id, ...atorData } = call.request;
      const ator = this.atorService.updateAtor(id, atorData);
      callback(null, ator);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 3, // NOT_FOUND : INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async deleteAtor(call, callback) {
    try {
      const { id } = call.request;
      const success = this.atorService.deleteAtor(id);
      callback(null, { 
        success, 
        message: success ? 'Ator deletado com sucesso' : 'Erro ao deletar ator' 
      });
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }
}

module.exports = AtorImplementation;
