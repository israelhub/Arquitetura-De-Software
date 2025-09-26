import { IProductProvider } from '../interfaces/IProductProvider';
import { JsonAdapter } from '../adapters/JsonAdapter';
import { CsvAdapter } from '../adapters/CsvAdapter';
import { XmlAdapter } from '../adapters/XmlAdapter';

/**
 * Factory Method para criação de provedores de produtos
 * Implementa o padrão Factory Method para instanciar adapters apropriados
 */
export class ProductProviderFactory {
  private static readonly adapters: Map<string, () => IProductProvider> = new Map();

  static {
    // Inicializa os adapters no bloco estático
    this.adapters.set('json', () => new JsonAdapter());
    this.adapters.set('csv', () => new CsvAdapter());
    this.adapters.set('xml', () => new XmlAdapter());
  }

  /**
   * Cria um provedor de produtos baseado no formato
   * @param format Formato do arquivo (json, csv, xml)
   * @returns IProductProvider Adapter apropriado para o formato
   */
  static createProvider(format: string): IProductProvider {
    const normalizedFormat = format.toLowerCase().trim();
    const adapterFactory = this.adapters.get(normalizedFormat);
    
    if (!adapterFactory) {
      throw new Error(`Formato '${format}' não suportado. Formatos suportados: ${this.getSupportedFormats().join(', ')}`);
    }

    return adapterFactory();
  }

  /**
   * Verifica se um formato é suportado
   * @param format Formato a ser verificado
   * @returns boolean Verdadeiro se o formato é suportado
   */
  static isFormatSupported(format: string): boolean {
    return this.adapters.has(format.toLowerCase().trim());
  }

  /**
   * Retorna a lista de formatos suportados
   * @returns string[] Lista de formatos suportados
   */
  static getSupportedFormats(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * Registra um novo adapter
   * @param format Formato do arquivo
   * @param adapterFactory Factory function para criar o adapter
   */
  static registerAdapter(format: string, adapterFactory: () => IProductProvider): void {
    this.adapters.set(format.toLowerCase().trim(), adapterFactory);
  }

  /**
   * Remove um adapter registrado
   * @param format Formato a ser removido
   */
  static unregisterAdapter(format: string): boolean {
    return this.adapters.delete(format.toLowerCase().trim());
  }

  /**
   * Detecta o formato baseado na extensão do arquivo
   * @param filePath Caminho do arquivo
   * @returns string Formato detectado
   */
  static detectFormatFromFile(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    
    const extensionMap: { [key: string]: string } = {
      'json': 'json',
      'csv': 'csv',
      'xml': 'xml',
      'txt': 'csv' // Assume que .txt é CSV por padrão
    };

    return extensionMap[extension] || '';
  }
}