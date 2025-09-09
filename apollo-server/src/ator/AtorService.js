class AtorService {
  constructor(dataSource) {
    this.dataSource = dataSource;
  }

  // Buscar todos os atores
  async findAll() {
    return await this.dataSource.findAll();
  }

  // Buscar ator por ID
  async findById(id) {
    return await this.dataSource.findById(id);
  }

  // Criar novo ator
  async create(input) {
    const { nome, dataNascimento } = input;
    
    // Validações
    if (!nome || nome.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }

    return await this.dataSource.create({
      nome: nome.trim(),
      dataNascimento
    });
  }

  // Atualizar ator
  async update(id, input) {
    const atorExistente = await this.dataSource.findById(id);
    if (!atorExistente) {
      throw new Error('Ator não encontrado');
    }

    const dadosAtualizados = {};
    
    if (input.nome !== undefined) {
      if (!input.nome || input.nome.trim().length === 0) {
        throw new Error('Nome não pode ser vazio');
      }
      dadosAtualizados.nome = input.nome.trim();
    }
    
    if (input.dataNascimento !== undefined) {
      dadosAtualizados.dataNascimento = input.dataNascimento;
    }

    return await this.dataSource.update(id, dadosAtualizados);
  }

  // Deletar ator
  async delete(id) {
    const atorExistente = await this.dataSource.findById(id);
    if (!atorExistente) {
      throw new Error('Ator não encontrado');
    }

    return await this.dataSource.delete(id);
  }

  // Buscar filmes de um ator
  async getFilmes(atorId) {
    return await this.dataSource.getFilmes(atorId);
  }
}

module.exports = AtorService;
