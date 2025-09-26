import * as fs from 'fs/promises';
import * as path from 'path';
import { Resume } from '../../models/resume';
import { ResumeSaver, SaveResult } from './types';

/**
 * Strategy para salvar currículos em formato texto simples local
 */
export class LocalTextSaver implements ResumeSaver {
  private outputDir: string;

  constructor(outputDir: string = './resumes') {
    this.outputDir = outputDir;
  }

  async save(resume: Resume, filename?: string): Promise<SaveResult> {
    try {
      // Garante que o diretório existe
      await this.ensureDirectoryExists();

      // Gera nome do arquivo se não fornecido
      const fileName = filename || this.generateFileName(resume, 'txt');
      const filePath = path.join(this.outputDir, fileName);

      // Converte para texto
      const textData = resume.toText();

      // Salva o arquivo
      await fs.writeFile(filePath, textData, 'utf-8');

      return {
        success: true,
        message: `Currículo salvo em texto: ${filePath}`,
        path: filePath,
        data: textData
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro ao salvar texto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  private async ensureDirectoryExists(): Promise<void> {
    try {
      await fs.access(this.outputDir);
    } catch {
      await fs.mkdir(this.outputDir, { recursive: true });
    }
  }

  private generateFileName(resume: Resume, extension: string): string {
    const safeName = resume.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    return `${safeName}_${timestamp}.${extension}`;
  }

  /**
   * Lista todos os currículos texto salvos
   */
  async listSavedResumes(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.outputDir);
      return files.filter(file => file.endsWith('.txt'));
    } catch {
      return [];
    }
  }
}
