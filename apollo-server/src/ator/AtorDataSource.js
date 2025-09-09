class AtorDataSource {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // Buscar todos os atores
  async findAll() {
    return await this.prisma.ator.findMany({
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
  }

  // Buscar ator por ID
  async findById(id) {
    return await this.prisma.ator.findUnique({
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

  // Criar novo ator
  async create(data) {
    return await this.prisma.ator.create({
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

  // Atualizar ator
  async update(id, data) {
    return await this.prisma.ator.update({
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

  // Deletar ator
  async delete(id) {
    try {
      await this.prisma.ator.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Erro ao deletar ator:', error);
      return false;
    }
  }

  // Buscar filmes de um ator
  async getFilmes(atorId) {
    const atorComFilmes = await this.prisma.ator.findUnique({
      where: { id: atorId },
      include: {
        filmes: {
          include: {
            filme: true
          }
        }
      }
    });
    
    return atorComFilmes?.filmes.map(f => f.filme) || [];
  }
}

module.exports = AtorDataSource;
