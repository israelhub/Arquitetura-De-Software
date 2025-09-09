class GeneroDataSource {
  constructor() {
    this.generos = [
      {
        id: 1,
        nome: "Drama"
      },
      {
        id: 2,
        nome: "Ação"
      },
      {
        id: 3,
        nome: "Comédia"
      },
      {
        id: 4,
        nome: "Terror"
      },
      {
        id: 5,
        nome: "Ficção Científica"
      }
    ];
    this.nextId = 6;
  }

  findAll() {
    return this.generos;
  }

  findById(id) {
    return this.generos.find(genero => genero.id === parseInt(id));
  }

  create(generoData) {
    const genero = {
      id: this.nextId++,
      ...generoData
    };
    this.generos.push(genero);
    return genero;
  }

  update(id, generoData) {
    const index = this.generos.findIndex(genero => genero.id === parseInt(id));
    if (index === -1) return null;
    
    this.generos[index] = { ...this.generos[index], ...generoData };
    return this.generos[index];
  }

  delete(id) {
    const index = this.generos.findIndex(genero => genero.id === parseInt(id));
    if (index === -1) return false;
    
    this.generos.splice(index, 1);
    return true;
  }
}

module.exports = GeneroDataSource;
