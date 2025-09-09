class FilmeService {
  constructor(filmeDataSource, atorDataSource, generoDataSource) {
    this.filmeDataSource = filmeDataSource;
    this.atorDataSource = atorDataSource;
    this.generoDataSource = generoDataSource;
  }

  listFilmes() {
    const filmes = this.filmeDataSource.findAll();
    return filmes.map(filme => this.enrichFilme(filme));
  }

  getFilme(id) {
    const filme = this.filmeDataSource.findById(id);
    if (!filme) {
      throw new Error(`Filme com ID ${id} não encontrado`);
    }
    return this.enrichFilme(filme);
  }

  createFilme(filmeData) {
    // Validação
    if (!filmeData.titulo || filmeData.titulo.trim() === '') {
      throw new Error('Título é obrigatório');
    }
    
    if (!filmeData.ano_lancamento || filmeData.ano_lancamento < 1900) {
      throw new Error('Ano de lançamento inválido');
    }

    // Verifica se o gênero existe
    const genero = this.generoDataSource.findById(filmeData.genero_id);
    if (!genero) {
      throw new Error(`Gênero com ID ${filmeData.genero_id} não encontrado`);
    }

    const filme = this.filmeDataSource.create(filmeData);
    return this.enrichFilme(filme);
  }

  updateFilme(id, filmeData) {
    const existingFilme = this.filmeDataSource.findById(id);
    if (!existingFilme) {
      throw new Error(`Filme com ID ${id} não encontrado`);
    }

    // Validações
    if (filmeData.titulo && filmeData.titulo.trim() === '') {
      throw new Error('Título não pode ser vazio');
    }

    if (filmeData.ano_lancamento && filmeData.ano_lancamento < 1900) {
      throw new Error('Ano de lançamento inválido');
    }

    if (filmeData.genero_id) {
      const genero = this.generoDataSource.findById(filmeData.genero_id);
      if (!genero) {
        throw new Error(`Gênero com ID ${filmeData.genero_id} não encontrado`);
      }
    }

    const filme = this.filmeDataSource.update(id, filmeData);
    return this.enrichFilme(filme);
  }

  deleteFilme(id) {
    const filme = this.filmeDataSource.findById(id);
    if (!filme) {
      throw new Error(`Filme com ID ${id} não encontrado`);
    }

    return this.filmeDataSource.delete(id);
  }

  getFilmeAtores(filmeId) {
    const filme = this.filmeDataSource.findById(filmeId);
    if (!filme) {
      throw new Error(`Filme com ID ${filmeId} não encontrado`);
    }

    const atorIds = this.filmeDataSource.getFilmeAtores(filmeId);
    return this.atorDataSource.findByIds(atorIds);
  }

  addAtorToFilme(filmeId, atorId) {
    // Verifica se o filme existe
    const filme = this.filmeDataSource.findById(filmeId);
    if (!filme) {
      throw new Error(`Filme com ID ${filmeId} não encontrado`);
    }

    // Verifica se o ator existe
    const ator = this.atorDataSource.findById(atorId);
    if (!ator) {
      throw new Error(`Ator com ID ${atorId} não encontrado`);
    }

    const added = this.filmeDataSource.addAtorToFilme(filmeId, atorId);
    if (!added) {
      throw new Error('Ator já está associado a este filme');
    }

    return true;
  }

  // Método auxiliar para enriquecer o filme com dados relacionados
  enrichFilme(filme) {
    const genero = this.generoDataSource.findById(filme.genero_id);
    const atorIds = this.filmeDataSource.getFilmeAtores(filme.id);
    const atores = this.atorDataSource.findByIds(atorIds);

    return {
      ...filme,
      genero: genero || null,
      atores: atores || []
    };
  }
}

module.exports = FilmeService;
