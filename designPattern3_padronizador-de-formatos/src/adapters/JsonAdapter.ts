import { readFile } from 'fs/promises';
import { Product } from '../models/Product';
import { IProductProvider } from '../interfaces/IProductProvider';
import { ProductBuilder } from '../builders/ProductBuilder';

/**
 * Adapter para arquivos JSON
 * Implementa o padrão Adapter para converter dados JSON em objetos Product
 */
export class JsonAdapter implements IProductProvider {
  private readonly format = 'json';

  async load(filePath: string): Promise<Product[]> {
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      
      // Suporta tanto array de produtos quanto objeto com propriedade products
      const products = Array.isArray(jsonData) ? jsonData : jsonData.products || [];
      
      return products.map((item: any) => this.adaptToProduct(item));
    } catch (error) {
      throw new Error(`Erro ao processar arquivo JSON: ${error}`);
    }
  }

  supports(format: string): boolean {
    return format.toLowerCase() === this.format;
  }

  getFormat(): string {
    return this.format;
  }

  /**
   * Adapta um objeto JSON para Product usando ProductBuilder
   */
  private adaptToProduct(item: any): Product {
    return new ProductBuilder()
      .setId(this.extractId(item))
      .setName(this.extractName(item))
      .setPrice(this.extractPrice(item))
      .build();
  }

  private extractId(item: any): string {
    return item.id || item.ID || item.productId || item.codigo || String(item.index || '');
  }

  private extractName(item: any): string {
    return item.name || item.nome || item.title || item.produto || '';
  }

  private extractPrice(item: any): number {
    const price = item.price || item.preco || item.valor || item.cost || 0;
    return typeof price === 'string' ? parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.')) : Number(price);
  }
}