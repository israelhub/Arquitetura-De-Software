class AtorDataSource {
  constructor() {
    this.atores = [
      {
        id: 1,
        nome: "Marlon Brando",
        data_nascimento: "1924-04-03"
      },
      {
        id: 2,
        nome: "Al Pacino",
        data_nascimento: "1940-04-25"
      },
      {
        id: 3,
        nome: "John Travolta",
        data_nascimento: "1954-02-18"
      },
      {
        id: 4,
        nome: "Samuel L. Jackson",
        data_nascimento: "1948-12-21"
      },
      {
        id: 5,
        nome: "Brad Pitt",
        data_nascimento: "1963-12-18"
      },
      {
        id: 6,
        nome: "Edward Norton",
        data_nascimento: "1969-08-18"
      }
    ];
    this.nextId = 7;
  }

  findAll() {
    return this.atores;
  }

  findById(id) {
    return this.atores.find(ator => ator.id === parseInt(id));
  }

  findByIds(ids) {
    return this.atores.filter(ator => ids.includes(ator.id));
  }

  create(atorData) {
    const ator = {
      id: this.nextId++,
      ...atorData
    };
    this.atores.push(ator);
    return ator;
  }

  update(id, atorData) {
    const index = this.atores.findIndex(ator => ator.id === parseInt(id));
    if (index === -1) return null;
    
    this.atores[index] = { ...this.atores[index], ...atorData };
    return this.atores[index];
  }

  delete(id) {
    const index = this.atores.findIndex(ator => ator.id === parseInt(id));
    if (index === -1) return false;
    
    this.atores.splice(index, 1);
    return true;
  }
}

module.exports = AtorDataSource;
