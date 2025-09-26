import { Product } from '../models/Product';

/**
 * Interface que define o contrato para provedores de produtos
 * Implementa o padrão Strategy através de diferentes implementações
 */
export interface IProductProvider {
  /**
   * Carrega e converte produtos do formato específico para Product[]
   * @param filePath Caminho para o arquivo de produtos
   * @returns Promise<Product[]> Lista de produtos padronizados
   */
  load(filePath: string): Promise<Product[]>;

  /**
   * Verifica se o provedor suporta o formato específico
   * @param format Formato do arquivo (csv, xml, json)
   * @returns boolean Verdadeiro se suporta o formato
   */
  supports(format: string): boolean;

  /**
   * Retorna o tipo de formato suportado pelo provedor
   * @returns string Formato suportado (csv, xml, json)
   */
  getFormat(): string;
}