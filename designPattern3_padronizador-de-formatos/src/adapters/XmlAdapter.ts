import { readFile } from 'fs/promises';
import { Product } from '../models/Product';
import { IProductProvider } from '../interfaces/IProductProvider';
import { ProductBuilder } from '../builders/ProductBuilder';

/**
 * Adapter para arquivos XML
 * Implementa o padrão Adapter para converter dados XML em objetos Product
 */
export class XmlAdapter implements IProductProvider {
  private readonly format = 'xml';

  async load(filePath: string): Promise<Product[]> {
    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const products = this.parseXML(fileContent);
      return products.map(item => this.adaptToProduct(item));
    } catch (error) {
      throw new Error(`Erro ao processar arquivo XML: ${error}`);
    }
  }

  supports(format: string): boolean {
    return format.toLowerCase() === this.format;
  }

  getFormat(): string {
    return this.format;
  }

  /**
   * Parser XML simples (sem dependências externas)
   * Para uma implementação robusta, considere usar xml2js
   */
  private parseXML(xmlContent: string): any[] {
    const products: any[] = [];
    
    // Remove quebras de linha e espaços extras
    const cleanXml = xmlContent.replace(/>\s+</g, '><').trim();
    
    // Encontra todos os elementos de produto
    const productMatches = cleanXml.match(/<product[^>]*>.*?<\/product>/gi) || 
                          cleanXml.match(/<item[^>]*>.*?<\/item>/gi) ||
                          cleanXml.match(/<produto[^>]*>.*?<\/produto>/gi);

    if (productMatches) {
      for (const productXml of productMatches) {
        const product = this.parseProductXML(productXml);
        if (product) {
          products.push(product);
        }
      }
    }

    return products;
  }

  /**
   * Extrai dados de um elemento XML de produto
   */
  private parseProductXML(productXml: string): any {
    const product: any = {};
    
    // Extrai atributos do elemento raiz
    const attributeMatch = productXml.match(/<(?:product|item|produto)([^>]*)>/i);
    if (attributeMatch && attributeMatch[1]) {
      const attributes = this.parseAttributes(attributeMatch[1]);
      Object.assign(product, attributes);
    }

    // Extrai elementos filhos
    const elementMatches = productXml.match(/<(\w+)>([^<]*)<\/\1>/g);
    if (elementMatches) {
      for (const elementMatch of elementMatches) {
        const [, tagName, value] = elementMatch.match(/<(\w+)>([^<]*)<\/\1>/) || [];
        if (tagName && value !== undefined) {
          product[tagName.toLowerCase()] = value.trim();
        }
      }
    }

    return product;
  }

  /**
   * Extrai atributos de uma string de atributos XML
   */
  private parseAttributes(attributeString: string): any {
    const attributes: any = {};
    const attrMatches = attributeString.match(/(\w+)=["']([^"']*)["']/g);
    
    if (attrMatches) {
      for (const attrMatch of attrMatches) {
        const [, name, value] = attrMatch.match(/(\w+)=["']([^"']*)["']/) || [];
        if (name && value !== undefined) {
          attributes[name.toLowerCase()] = value;
        }
      }
    }

    return attributes;
  }

  /**
   * Adapta um objeto XML para Product usando ProductBuilder
   */
  private adaptToProduct(item: any): Product {
    return new ProductBuilder()
      .setId(this.extractId(item))
      .setName(this.extractName(item))
      .setPrice(this.extractPrice(item))
      .build();
  }

  private extractId(item: any): string {
    // Busca por id em atributos e elementos, com fallback para gerar ID
    const id = item.id || item.codigo || item.productid || item.sku || item.index;
    if (id) return String(id);
    
    // Se não encontrou ID, gera um baseado no nome
    if (item.name) {
      return item.name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 10);
    }
    
    // Último recurso: gera ID baseado no timestamp
    return String(Date.now()).substring(-6);
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