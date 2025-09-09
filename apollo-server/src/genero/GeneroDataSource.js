class GeneroDataSource {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return await this.prisma.genero.findMany({
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
  }

  async findById(id) {
    return await this.prisma.genero.findUnique({
      where: { id },
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
  }

  async create(data) {
    return await this.prisma.genero.create({
      data,
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
  }

  async update(id, data) {
    return await this.prisma.genero.update({
      where: { id },
      data,
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
  }

  async delete(id) {
    try {
      await this.prisma.genero.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar gênero:', error);
      return false;
    }
  }

  async getFilmes(generoId) {
    const generoComFilmes = await this.prisma.genero.findUnique({
      where: { id: generoId },
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
    
    return generoComFilmes?.filmes.map(f => f.filme) || [];
  }
}

module.exports = GeneroDataSource;
