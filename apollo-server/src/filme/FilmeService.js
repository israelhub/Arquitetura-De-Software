class FilmeService {
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
    if (!input.titulo || input.titulo.trim().length === 0) {
      throw new Error('Título é obrigatório');
    }
    if (!input.ano || input.ano < 1900) {
      throw new Error('Ano deve ser válido');
    }
    return await this.dataSource.create({
      titulo: input.titulo.trim(),
      ano: input.ano
    });
  }

  async update(id, input) {
    const filmeExistente = await this.dataSource.findById(id);
    if (!filmeExistente) {
      throw new Error('Filme não encontrado');
    }
    const dadosAtualizados = {};
    if (input.titulo !== undefined) {
      if (!input.titulo || input.titulo.trim().length === 0) {
        throw new Error('Título não pode ser vazio');
      }
      dadosAtualizados.titulo = input.titulo.trim();
    }
    if (input.ano !== undefined) {
      if (input.ano < 1900) {
        throw new Error('Ano deve ser válido');
      }
      dadosAtualizados.ano = input.ano;
    }
    return await this.dataSource.update(id, dadosAtualizados);
  }

  async delete(id) {
    const filmeExistente = await this.dataSource.findById(id);
    if (!filmeExistente) {
      throw new Error('Filme não encontrado');
    }
    return await this.dataSource.delete(id);
  }
}

module.exports = FilmeService;
