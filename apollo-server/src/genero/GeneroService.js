class GeneroService {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  async findAll() {
    return await this.dataSource.findAll();
  }

  async findById(id) {
    return await this.dataSource.findById(id);
  }

  async create(input) {
    const { nome } = input;
    
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }

    return await this.dataSource.create({
      nome: nome.trim()
    });
  }

  async update(id, input) {
    const generoExistente = await this.dataSource.findById(id);
    if (!generoExistente) {
      throw new Error('Gênero não encontrado');
    }

    const dadosAtualizados = {};
    
    if (input.nome !== undefined) {
      if (!input.nome || input.nome.trim().length === 0) {
        throw new Error('Nome não pode ser vazio');
      }
      dadosAtualizados.nome = input.nome.trim();
    }

    return await this.dataSource.update(id, dadosAtualizados);
  }

  async delete(id) {
    const generoExistente = await this.dataSource.findById(id);
    if (!generoExistente) {
      throw new Error('Gênero não encontrado');
    }

    return await this.dataSource.delete(id);
  }

  async getFilmes(generoId) {
    return await this.dataSource.getFilmes(generoId);
  }
}

module.exports = GeneroService;
