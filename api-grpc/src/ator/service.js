class AtorService {
  constructor(atorDataSource) {
    this.atorDataSource = atorDataSource;
  }

  listAtores() {
    return this.atorDataSource.findAll();
  }

  getAtor(id) {
    const ator = this.atorDataSource.findById(id);
    if (!ator) {
      throw new Error(`Ator com ID ${id} não encontrado`);
    }
    return ator;
  }

  createAtor(atorData) {
    // Validação
    if (!atorData.nome || atorData.nome.trim() === '') {
      throw new Error('Nome é obrigatório');
    }

    if (!atorData.data_nascimento) {
      throw new Error('Data de nascimento é obrigatória');
    }

    // Validação básica de data (formato YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(atorData.data_nascimento)) {
      throw new Error('Data de nascimento deve estar no formato YYYY-MM-DD');
    }

    return this.atorDataSource.create(atorData);
  }

  updateAtor(id, atorData) {
    const existingAtor = this.atorDataSource.findById(id);
    if (!existingAtor) {
      throw new Error(`Ator com ID ${id} não encontrado`);
    }

    // Validações
    if (atorData.nome && atorData.nome.trim() === '') {
      throw new Error('Nome não pode ser vazio');
    }

    if (atorData.data_nascimento) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(atorData.data_nascimento)) {
        throw new Error('Data de nascimento deve estar no formato YYYY-MM-DD');
      }
    }

    return this.atorDataSource.update(id, atorData);
  }

  deleteAtor(id) {
    const ator = this.atorDataSource.findById(id);
    if (!ator) {
      throw new Error(`Ator com ID ${id} não encontrado`);
    }

    return this.atorDataSource.delete(id);
  }
}

module.exports = AtorService;
