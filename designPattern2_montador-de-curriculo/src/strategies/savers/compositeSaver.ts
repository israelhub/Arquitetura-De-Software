import { Resume } from '../../models/resume';
import { ResumeSaver, SaveResult } from './types';

/**
 * Strategy Composite que permite salvar em múltiplos formatos simultaneamente
 * Implementa o padrão Composite para combinar várias strategies
 */
export class CompositeSaver implements ResumeSaver {
  private savers: ResumeSaver[];

  constructor(savers: ResumeSaver[] = []) {
    this.savers = savers;
  }

  /**
   * Adiciona um novo saver à lista
   */
  addSaver(saver: ResumeSaver): void {
    this.savers.push(saver);
  }

  /**
   * Remove um saver da lista
   */
  removeSaver(saver: ResumeSaver): void {
    const index = this.savers.indexOf(saver);
    if (index > -1) {
      this.savers.splice(index, 1);
    }
  }

  /**
   * Salva o currículo usando todos os savers configurados
   * Executa em paralelo para melhor performance
   */
  async save(resume: Resume, filename?: string): Promise<SaveResult> {
    if (this.savers.length === 0) {
      return {
        success: false,
        message: 'Nenhum saver configurado no CompositeSaver'
      };
    }

    try {
      // Executa todos os savers em paralelo
      const promises = this.savers.map(saver => saver.save(resume, filename));
      const results = await Promise.allSettled(promises);

      // Analisa os resultados
      const successResults: SaveResult[] = [];
      const failedResults: SaveResult[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            successResults.push(result.value);
          } else {
            failedResults.push(result.value);
          }
        } else {
          failedResults.push({
            success: false,
            message: `Saver ${index + 1} falhou: ${result.reason}`
          });
        }
      });

      // Monta resultado consolidado
      const totalSuccessful = successResults.length;
      const totalFailed = failedResults.length;
      const total = totalSuccessful + totalFailed;

      let consolidatedMessage = `Salvamento consolidado: ${totalSuccessful}/${total} bem-sucedidos.`;
      
      if (successResults.length > 0) {
        consolidatedMessage += `\n\nSucessos:\n`;
        successResults.forEach((result, index) => {
          consolidatedMessage += `${index + 1}. ${result.message}\n`;
        });
      }

      if (failedResults.length > 0) {
        consolidatedMessage += `\n\nFalhas:\n`;
        failedResults.forEach((result, index) => {
          consolidatedMessage += `${index + 1}. ${result.message}\n`;
        });
      }

      return {
        success: totalSuccessful > 0, // Sucesso se pelo menos um salvou
        message: consolidatedMessage,
        data: {
          successful: successResults,
          failed: failedResults,
          summary: {
            total,
            successful: totalSuccessful,
            failed: totalFailed
          }
        }
      };

    } catch (error) {
      return {
        success: false,
        message: `Erro inesperado no CompositeSaver: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  /**
   * Retorna a quantidade de savers configurados
   */
  getSaverCount(): number {
    return this.savers.length;
  }

  /**
   * Limpa todos os savers
   */
  clearSavers(): void {
    this.savers = [];
  }
}
