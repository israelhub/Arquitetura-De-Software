import inquirer from 'inquirer';
import { ResumeBuilder } from '../builders/resumeBuilder';
import { SaverFactory } from '../factories/saverFactory';
import { SaverType } from '../strategies/savers/types';
import { Config } from '../config/config';

/**
 * Interface de linha de comando interativa para criar currículos
 * Coleta dados em etapas e usa o padrão Builder
 */
export class ResumeCLI {
  private config: Config;
  private builder: ResumeBuilder;

  constructor() {
    this.config = Config.getInstance();
    this.builder = new ResumeBuilder();
  }

  /**
   * Inicia a aplicação CLI
   */
  async start(): Promise<void> {
    console.log('Bem-vindo ao Criador de Currículos!');
    console.log('===================================');
    console.log();

    while (true) {
      try {
        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'O que você gostaria de fazer?',
            choices: [
              { name: 'Criar novo currículo', value: 'create' },
              { name: 'Sair', value: 'exit' }
            ]
          }
        ]);

        switch (action) {
          case 'create':
            await this.createResume();
            break;
          case 'exit':
            console.log('Obrigado por usar o Criador de Currículos!');
            return;
        }

        console.log();

      } catch (error) {
        console.error('Erro inesperado:', error instanceof Error ? error.message : 'Erro desconhecido');
        console.log();
      }
    }
  }

  /**
   * Processo principal de criação de currículo
   */
  private async createResume(): Promise<void> {
    console.log('Vamos criar seu currículo passo a passo...');
    console.log();

    try {
      // Reset do builder para novo currículo
      this.builder.reset();

      // Coleta dados básicos
      await this.collectBasicInfo();

      // Coleta experiências profissionais
      await this.collectExperiences();

      // Coleta formação acadêmica
      await this.collectEducation();

      // Constrói o currículo
      const resume = this.builder.build();

      // Exibe preview
      console.log('Preview do seu currículo:');
      console.log('-'.repeat(50));
      console.log(resume.toText());
      console.log('-'.repeat(50));

      // Pergunta sobre salvamento
      await this.handleSaving(resume);

    } catch (error) {
      console.error('Erro ao criar currículo:', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  }

  /**
   * Coleta informações básicas
   */
  private async collectBasicInfo(): Promise<void> {
    const basicInfo = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Qual é o seu nome completo?',
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Nome é obrigatório';
          }
          return true;
        }
      },
      {
        type: 'input',
        name: 'contact',
        message: 'Qual é o seu contato (email, telefone, etc.)?',
        validate: (input: string) => {
          if (!input || input.trim() === '') {
            return 'Contato é obrigatório';
          }
          return true;
        }
      }
    ]);

    this.builder.withName(basicInfo.name).withContact(basicInfo.contact);
    console.log('Informações básicas adicionadas!');
  }

  /**
   * Coleta experiências profissionais
   */
  private async collectExperiences(): Promise<void> {
    console.log('Agora vamos adicionar suas experiências profissionais...');
    
    let addMore = true;
    while (addMore) {
      const { wantToAdd } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'wantToAdd',
          message: 'Deseja adicionar uma experiência profissional?',
          default: true
        }
      ]);

      if (!wantToAdd) {
        addMore = false;
        continue;
      }

      const experience = await inquirer.prompt([
        {
          type: 'input',
          name: 'position',
          message: 'Cargo/Posição:',
          validate: (input: string) => input.trim() !== '' || 'Cargo é obrigatório'
        },
        {
          type: 'input',
          name: 'company',
          message: 'Empresa:',
          validate: (input: string) => input.trim() !== '' || 'Empresa é obrigatória'
        },
        {
          type: 'input',
          name: 'period',
          message: 'Período (ex: 2020-2024, Jan 2020 - Presente):',
          validate: (input: string) => input.trim() !== '' || 'Período é obrigatório'
        }
      ]);

      this.builder.addExperience(experience.position, experience.company, experience.period);
      console.log('Experiência adicionada!');
    }
  }

  /**
   * Coleta formação acadêmica
   */
  private async collectEducation(): Promise<void> {
    console.log('Agora vamos adicionar sua formação acadêmica...');
    
    let addMore = true;
    while (addMore) {
      const { wantToAdd } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'wantToAdd',
          message: 'Deseja adicionar uma formação acadêmica?',
          default: true
        }
      ]);

      if (!wantToAdd) {
        addMore = false;
        continue;
      }

      const education = await inquirer.prompt([
        {
          type: 'input',
          name: 'degree',
          message: 'Curso/Grau (ex: Bacharelado em Ciência da Computação):',
          validate: (input: string) => input.trim() !== '' || 'Curso é obrigatório'
        },
        {
          type: 'input',
          name: 'institution',
          message: 'Instituição:',
          validate: (input: string) => input.trim() !== '' || 'Instituição é obrigatória'
        },
        {
          type: 'input',
          name: 'period',
          message: 'Período (ex: 2016-2020):',
          validate: (input: string) => input.trim() !== '' || 'Período é obrigatório'
        }
      ]);

      this.builder.addEducation(education.degree, education.institution, education.period);
      console.log('Formação adicionada!');
    }
  }

  /**
   * Gerencia o processo de salvamento
   */
  private async handleSaving(resume: any): Promise<void> {
    const { saveOptions } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'saveOptions',
        message: 'Como você gostaria de salvar o currículo?',
        choices: [
          { name: 'Arquivo de texto (.txt)', value: 'text', checked: true },
          { name: 'Arquivo JSON (.json)', value: 'json', checked: true }
        ],
        validate: (choices: string[]) => {
          if (choices.length === 0) {
            return 'Selecione pelo menos uma opção de salvamento';
          }
          return true;
        }
      }
    ]);

    // Pergunta sobre nome do arquivo personalizado
    const { customFilename } = await inquirer.prompt([
      {
        type: 'input',
        name: 'customFilename',
        message: 'Nome personalizado do arquivo (opcional, deixe vazio para gerar automaticamente):',
        default: ''
      }
    ]);

    const filename = customFilename.trim() || undefined;

    // Cria savers baseado nas opções selecionadas
    const saverTypes: SaverType[] = [];
    if (saveOptions.includes('text')) saverTypes.push(SaverType.LOCAL_TEXT);
    if (saveOptions.includes('json')) saverTypes.push(SaverType.LOCAL_JSON);

    if (saverTypes.length === 1) {
      // Um único saver
      const saver = SaverFactory.createSaver(saverTypes[0]);
      const result = await saver.save(resume, filename);
      
      if (result.success) {
        console.log('Sucesso:', result.message);
      } else {
        console.log('Erro:', result.message);
      }
    } else {
      // Múltiplos savers usando Composite
      const compositeSaver = SaverFactory.createCompositeSaverFromTypes(saverTypes);
      const result = await compositeSaver.save(resume, filename);
      
      console.log(result.success ? 'Sucesso:' : 'Aviso:', result.message);
    }
  }

  //
}

// Inicia a CLI se o arquivo for executado diretamente
if (require.main === module) {
  const cli = new ResumeCLI();
  cli.start().catch(error => {
    console.error('Erro fatal na CLI:', error);
    process.exit(1);
  });
}
