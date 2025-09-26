import { ResumeBuilder } from './src/builders/resumeBuilder';
import { SaverFactory } from './src/factories/saverFactory';

/**
 * Exemplo de uso do sistema de currículos
 * Demonstra o uso dos padrões implementados
 */
async function exemploUso() {
  console.log('🎯 Exemplo de uso do Sistema de Currículos');
  console.log('===========================================\n');

  try {
    // 1. Criar currículo usando Builder Pattern
    console.log('1️⃣ Criando currículo com Builder Pattern...');
    const resume = new ResumeBuilder()
      .withName("Diego Castro")
      .withContact("diego.castro@cefet-rj.br")
      .addExperience("Professor", "CEFET-RJ", "2015-2024")
      .addExperience("Desenvolvedor Senior", "Tech Corp", "2012-2015")
      .addEducation("Doutorado em Computação", "UFRJ", "2019-2023")
      .addEducation("Mestrado em Informática", "PUC-Rio", "2010-2012")
      .build();

    console.log('✅ Currículo criado com sucesso!\n');

    // 2. Salvar usando Strategy Pattern + Factory Method
    console.log('2️⃣ Salvando usando diferentes strategies...');

    // Strategy 1: Arquivo JSON local
    const jsonSaver = SaverFactory.createLocalJsonSaver();
    const jsonResult = await jsonSaver.save(resume, 'exemplo_diego.json');
    console.log('📄', jsonResult.message);

    // Strategy 2: Arquivo texto local  
    const textSaver = SaverFactory.createLocalTextSaver();
    const textResult = await textSaver.save(resume, 'exemplo_diego.txt');
    console.log('📝', textResult.message);

    // Strategy 3: Composite (salva em múltiplos formatos)
    const compositeSaver = SaverFactory.createLocalCompositeSaver();
    const compositeResult = await compositeSaver.save(resume, 'exemplo_composite');
    console.log('🔄', 'Salvamento composite:');
    console.log(compositeResult.message);

    console.log('\n✅ Exemplo executado com sucesso!');
    console.log('\n📁 Verifique a pasta ./resumes para ver os arquivos gerados');

  } catch (error) {
    console.error('❌ Erro no exemplo:', error instanceof Error ? error.message : error);
  }
}

// Executa o exemplo
exemploUso();