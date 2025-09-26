import { ResumeSaver, SaverType } from '../strategies/savers/types';
import { LocalJsonSaver } from '../strategies/savers/localJsonSaver';
import { LocalTextSaver } from '../strategies/savers/localTextSaver';
import { CompositeSaver } from '../strategies/savers/compositeSaver';

/**
 * Factory Method para criar diferentes tipos de savers
 * Implementa o padrão Factory Method para abstrair a criação de strategies
 */
export class SaverFactory {
  private static defaultOutputDir = './resumes';

  /**
   * Cria um saver baseado no tipo especificado
   */
  static createSaver(type: SaverType, options?: any): ResumeSaver {
    switch (type) {
      case SaverType.LOCAL_JSON:
        return new LocalJsonSaver(options?.outputDir || this.defaultOutputDir);

      case SaverType.LOCAL_TEXT:
        return new LocalTextSaver(options?.outputDir || this.defaultOutputDir);

      case SaverType.COMPOSITE:
        const savers = options?.savers || [];
        return new CompositeSaver(savers);

      default:
        throw new Error(`Tipo de saver não suportado: ${type}`);
    }
  }

  /**
   * Cria um saver local JSON com configurações padrão
   */
  static createLocalJsonSaver(outputDir?: string): LocalJsonSaver {
    return this.createSaver(SaverType.LOCAL_JSON, { outputDir }) as LocalJsonSaver;
  }

  /**
   * Cria um saver local de texto com configurações padrão
   */
  static createLocalTextSaver(outputDir?: string): LocalTextSaver {
    return this.createSaver(SaverType.LOCAL_TEXT, { outputDir }) as LocalTextSaver;
  }

  /**
   * Cria um composite saver com savers locais (JSON + Texto)
   */
  static createLocalCompositeSaver(outputDir?: string): CompositeSaver {
    const jsonSaver = this.createLocalJsonSaver(outputDir);
    const textSaver = this.createLocalTextSaver(outputDir);
    return new CompositeSaver([jsonSaver, textSaver]);
  }

  /**
   * Cria savers baseado em uma lista de tipos
   */
  static createMultipleSavers(types: SaverType[], options?: any): ResumeSaver[] {
    return types.map(type => this.createSaver(type, options));
  }

  /**
   * Cria um composite saver baseado em uma lista de tipos
   */
  static createCompositeSaverFromTypes(types: SaverType[], options?: any): CompositeSaver {
    const savers = this.createMultipleSavers(types, options);
    return new CompositeSaver(savers);
  }

  /**
   * Lista todos os tipos de savers disponíveis
   */
  static getAvailableSaverTypes(): SaverType[] {
    return Object.values(SaverType);
  }

  /**
   * Obtém descrições dos tipos de savers
   */
  static getSaverTypeDescriptions(): Record<SaverType, string> {
    return {
      [SaverType.LOCAL_JSON]: 'Salva currículo em arquivo JSON local',
      [SaverType.LOCAL_TEXT]: 'Salva currículo em arquivo de texto local',
      [SaverType.COMPOSITE]: 'Combina múltiplos savers'
    };
  }
}
