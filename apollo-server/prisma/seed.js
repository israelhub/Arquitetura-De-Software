const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar gêneros
  const generoAcao = await prisma.genero.create({
    data: { nome: 'Ação' }
  });

  const generoComedia = await prisma.genero.create({
    data: { nome: 'Comédia' }
  });

  const generoDrama = await prisma.genero.create({
    data: { nome: 'Drama' }
  });

  console.log('✅ Gêneros criados');

  // Criar atores
  const ator1 = await prisma.ator.create({
    data: {
      nome: 'Leonardo DiCaprio',
      dataNascimento: '1974-11-11'
    }
  });

  const ator2 = await prisma.ator.create({
    data: {
      nome: 'Robert Downey Jr.',
      dataNascimento: '1965-04-04'
    }
  });

  const ator3 = await prisma.ator.create({
    data: {
      nome: 'Scarlett Johansson',
      dataNascimento: '1984-11-22'
    }
  });

  console.log('✅ Atores criados');

  // Criar filmes
  const filme1 = await prisma.filme.create({
    data: {
      titulo: 'Inception',
      ano: 2010
    }
  });

  const filme2 = await prisma.filme.create({
    data: {
      titulo: 'Iron Man',
      ano: 2008
    }
  });

  const filme3 = await prisma.filme.create({
    data: {
      titulo: 'The Avengers',
      ano: 2012
    }
  });

  console.log('✅ Filmes criados');

  // Criar relacionamentos Filme-Ator
  await prisma.filmeAtor.createMany({
    data: [
      { filmeId: filme1.id, atorId: ator1.id },
      { filmeId: filme2.id, atorId: ator2.id },
      { filmeId: filme3.id, atorId: ator2.id },
      { filmeId: filme3.id, atorId: ator3.id },
    ]
  });

  console.log('✅ Relacionamentos Filme-Ator criados');

  // Criar relacionamentos Filme-Gênero
  await prisma.filmeGenero.createMany({
    data: [
      { filmeId: filme1.id, generoId: generoAcao.id },
      { filmeId: filme1.id, generoId: generoDrama.id },
      { filmeId: filme2.id, generoId: generoAcao.id },
      { filmeId: filme3.id, generoId: generoAcao.id },
    ]
  });

  console.log('✅ Relacionamentos Filme-Gênero criados');
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
