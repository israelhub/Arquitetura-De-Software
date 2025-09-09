const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Iniciando seed de usuários...');

  // Aqui você pode adicionar seeds específicos para usuários
  // Por exemplo:
  
  // const usuario1 = await prisma.usuario.create({
  //   data: {
  //     nome: 'Admin',
  //     email: 'admin@exemplo.com'
  //   }
  // });

  console.log('✅ Seed de usuários concluído!');
}

// Exportar para ser usado pelo seed principal
module.exports = seedUsers;

// Se executado diretamente
if (require.main === module) {
  seedUsers()
    .catch((e) => {
      console.error('❌ Erro no seed de usuários:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
