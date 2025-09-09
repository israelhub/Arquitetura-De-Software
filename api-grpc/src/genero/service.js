class GeneroService {
  constructor(generoDataSource) {
    this.generoDataSource = generoDataSource;
  }

  listGeneros() {
    return this.generoDataSource.findAll();
  }

  getGenero(id) {
    const genero = this.generoDataSource.findById(id);
    if (!genero) {
      throw new Error(`Gênero com ID ${id} não encontrado`);
    }
    return genero;
  }

  createGenero(generoData) {
    // Validação
    if (!generoData.nome || generoData.nome.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    // Verifica se já existe um gênero com o mesmo nome
    const existingGenero = this.generoDataSource.findAll().find(
      g => g.nome.toLowerCase() === generoData.nome.toLowerCase()
    );

    if (existingGenero) {
      throw new Error('Já existe um gênero com este nome');
    }

    return this.generoDataSource.create(generoData);
  }

  updateGenero(id, generoData) {
    const existingGenero = this.generoDataSource.findById(id);
    if (!existingGenero) {
      throw new Error(`Gênero com ID ${id} não encontrado`);
    }

    // Validações
    if (generoData.nome && generoData.nome.trim() === '') {
      throw new Error('Nome não pode ser vazio');
    }

    // Verifica se já existe outro gênero com o mesmo nome
    if (generoData.nome) {
      const duplicateGenero = this.generoDataSource.findAll().find(
        g => g.id !== parseInt(id) && g.nome.toLowerCase() === generoData.nome.toLowerCase()
      );

      if (duplicateGenero) {
        throw new Error('Já existe um gênero com este nome');
      }
    }

    return this.generoDataSource.update(id, generoData);
  }

  deleteGenero(id) {
    const genero = this.generoDataSource.findById(id);
    if (!genero) {
      throw new Error(`Gênero com ID ${id} não encontrado`);
    }

    return this.generoDataSource.delete(id);
  }
}

module.exports = GeneroService;
