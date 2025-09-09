class FilmeImplementation {
  constructor(filmeService) {
    this.filmeService = filmeService;
  }

  async listFilmes(call, callback) {
    try {
      const filmes = this.filmeService.listFilmes();
      callback(null, { filmes });
    } catch (error) {
      callback({
        code: 13, // INTERNAL
        details: error.message
      });
    }
  }

  async getFilme(call, callback) {
    try {
      const { id } = call.request;
      const filme = this.filmeService.getFilme(id);
      callback(null, filme);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }

  async createFilme(call, callback) {
    try {
      const filmeData = call.request;
      const filme = this.filmeService.createFilme(filmeData);
      callback(null, filme);
    } catch (error) {
      callback({
        code: 3, // INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async updateFilme(call, callback) {
    try {
      const { id, ...filmeData } = call.request;
      const filme = this.filmeService.updateFilme(id, filmeData);
      callback(null, filme);
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 3, // NOT_FOUND : INVALID_ARGUMENT
        details: error.message
      });
    }
  }

  async deleteFilme(call, callback) {
    try {
      const { id } = call.request;
      const success = this.filmeService.deleteFilme(id);
      callback(null, { 
        success, 
        message: success ? 'Filme deletado com sucesso' : 'Erro ao deletar filme' 
      });
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }

  async getFilmeAtores(call, callback) {
    try {
      const { filme_id } = call.request;
      const atores = this.filmeService.getFilmeAtores(filme_id);
      callback(null, { atores });
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 13, // NOT_FOUND : INTERNAL
        details: error.message
      });
    }
  }

  async addAtorToFilme(call, callback) {
    try {
      const { filme_id, ator_id } = call.request;
      const success = this.filmeService.addAtorToFilme(filme_id, ator_id);
      callback(null, { 
        success, 
        message: success ? 'Ator adicionado ao filme com sucesso' : 'Erro ao adicionar ator ao filme' 
      });
    } catch (error) {
      callback({
        code: error.message.includes('não encontrado') ? 5 : 3, // NOT_FOUND : INVALID_ARGUMENT
        details: error.message
      });
    }
  }
}

module.exports = FilmeImplementation;
