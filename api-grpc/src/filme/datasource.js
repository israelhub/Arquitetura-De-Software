class FilmeDataSource {
  constructor() {
    this.filmes = [
      {
        id: 1,
        titulo: "O Poderoso Chefão",
        ano_lancamento: 1972,
        genero_id: 1
      },
      {
        id: 2,
        titulo: "Pulp Fiction",
        ano_lancamento: 1994,
        genero_id: 1
      },
      {
        id: 3,
        titulo: "Clube da Luta",
        ano_lancamento: 1999,
        genero_id: 1
      }
    ];
    
    // Relacionamento N:N entre filmes e atores
    this.filme_atores = [
      { filme_id: 1, ator_id: 1 },
      { filme_id: 1, ator_id: 2 },
      { filme_id: 2, ator_id: 3 },
      { filme_id: 2, ator_id: 4 },
      { filme_id: 3, ator_id: 5 },
      { filme_id: 3, ator_id: 6 }
    ];
    
    this.nextId = 4;
  }

  findAll() {
    return this.filmes;
  }

  findById(id) {
    return this.filmes.find(filme => filme.id === parseInt(id));
  }

  create(filmeData) {
    const filme = {
      id: this.nextId++,
      ...filmeData
    };
    this.filmes.push(filme);
    return filme;
  }

  update(id, filmeData) {
    const index = this.filmes.findIndex(filme => filme.id === parseInt(id));
    if (index === -1) return null;
    
    this.filmes[index] = { ...this.filmes[index], ...filmeData };
    return this.filmes[index];
  }

  delete(id) {
    const index = this.filmes.findIndex(filme => filme.id === parseInt(id));
    if (index === -1) return false;
    
    // Remove relacionamentos
    this.filme_atores = this.filme_atores.filter(rel => rel.filme_id !== parseInt(id));
    
    this.filmes.splice(index, 1);
    return true;
  }

  getFilmeAtores(filmeId) {
    return this.filme_atores
      .filter(rel => rel.filme_id === parseInt(filmeId))
      .map(rel => rel.ator_id);
  }

  addAtorToFilme(filmeId, atorId) {
    const exists = this.filme_atores.some(
      rel => rel.filme_id === parseInt(filmeId) && rel.ator_id === parseInt(atorId)
    );
    
    if (!exists) {
      this.filme_atores.push({ 
        filme_id: parseInt(filmeId), 
        ator_id: parseInt(atorId) 
      });
      return true;
    }
    return false;
  }
}

module.exports = FilmeDataSource;
