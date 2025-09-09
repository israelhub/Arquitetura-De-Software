class FilmeDataSource {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async findAll() {
    return await this.prisma.filme.findMany({
      include: {
        atores: { include: { ator: true } },
        generos: { include: { genero: true } }
      }
    });
  }

  async findById(id) {
    return await this.prisma.filme.findUnique({
      where: { id },
      include: {
        atores: { include: { ator: true } },
        generos: { include: { genero: true } }
      }
    });
  }

  async create(data) {
    return await this.prisma.filme.create({
      data,
      include: {
        atores: { include: { ator: true } },
        generos: { include: { genero: true } }
      }
    });
  }

  async update(id, data) {
    return await this.prisma.filme.update({
      where: { id },
      data,
      include: {
        atores: { include: { ator: true } },
        generos: { include: { genero: true } }
      }
    });
  }

  async delete(id) {
    try {
      await this.prisma.filme.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async addAtores(filmeId, atorIds) {
    const novasAssociacoes = atorIds.map(atorId => ({ filmeId, atorId }));
    await this.prisma.filmeAtor.createMany({
      data: novasAssociacoes,
      skipDuplicates: true
    });
    return await this.findById(filmeId);
  }

  async removeAtor(filmeId, atorId) {
    await this.prisma.filmeAtor.delete({
      where: { filmeId_atorId: { filmeId, atorId } }
    });
    return await this.findById(filmeId);
  }

  async addGeneros(filmeId, generoIds) {
    const novasAssociacoes = generoIds.map(generoId => ({ filmeId, generoId }));
    await this.prisma.filmeGenero.createMany({
      data: novasAssociacoes,
      skipDuplicates: true
    });
    return await this.findById(filmeId);
  }
}

module.exports = FilmeDataSource;
