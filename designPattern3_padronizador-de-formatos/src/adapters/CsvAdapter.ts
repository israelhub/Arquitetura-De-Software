import { readFile } from 'fs/promises';
import { Product } from '../models/Product';
import { IProductProvider } from '../interfaces/IProductProvider';
import { ProductBuilder } from '../builders/ProductBuilder';

/**
 * Adapter para arquivos CSV
 * Implementa o padrão Adapter para converter dados CSV em objetos Product
 */
export class CsvAdapter implements IProductProvider {
  private readonly format = 'csv';

  async load(filePath: string): Promise<Product[]> {
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n');
      
      if (lines.length === 0) {
        return [];
      }

      // Primeira linha contém os cabeçalhos
      const headers = this.parseCSVLine(lines[0]);
      const products: Product[] = [];

      // Processa cada linha de dados
      for (let i = 1; i < lines.length; i++) {
        const values = this.parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
          const productData = this.createObjectFromCSV(headers, values);
          products.push(this.adaptToProduct(productData));
        }
      }

      return products;
    } catch (error) {
      throw new Error(`Erro ao processar arquivo CSV: ${error}`);
    }
  }

  supports(format: string): boolean {
    return format.toLowerCase() === this.format;
  }

  getFormat(): string {
    return this.format;
  }

  /**
   * Faz o parse de uma linha CSV considerando vírgulas dentro de aspas
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  /**
   * Cria um objeto a partir dos cabeçalhos e valores CSV
   */
  private createObjectFromCSV(headers: string[], values: string[]): any {
    const obj: any = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i].toLowerCase().replace(/[^a-z0-9]/g, '')] = values[i] || '';
    }
    return obj;
  }

  /**
   * Adapta um objeto CSV para Product usando ProductBuilder
   */
  private adaptToProduct(item: any): Product {
    return new ProductBuilder()
      .setId(this.extractId(item))
      .setName(this.extractName(item))
      .setPrice(this.extractPrice(item))
      .build();
  }

  private extractId(item: any): string {
    return item.id || item.codigo || item.productid || item.sku || String(item.index || '');
  }

  private extractName(item: any): string {
    return item.name || item.nome || item.produto || item.title || item.description || '';
  }

  private extractPrice(item: any): number {
    const priceFields = ['price', 'preco', 'valor', 'cost', 'custo'];
    for (const field of priceFields) {
      if (item[field] !== undefined) {
        const price = item[field];
        return typeof price === 'string' ? 
          parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.')) : 
          Number(price);
      }
    }
    return 0;
  }
}