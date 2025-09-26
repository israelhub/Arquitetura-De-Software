import { Product } from '../models/Product';

/**
 * Builder para construção de objetos Product
 * Implementa o padrão Builder para criar produtos de forma flexível
 */
export class ProductBuilder {
  private id: string = '';
  private name: string = '';
  private price: number = 0;

  /**
   * Define o ID do produto
   */
  setId(id: string): ProductBuilder {
    this.id = id?.trim() || '';
    return this;
  }

  /**
   * Define o nome do produto
   */
  setName(name: string): ProductBuilder {
    this.name = name?.trim() || '';
    return this;
  }

  /**
   * Define o preço do produto
   */
  setPrice(price: number | string): ProductBuilder {
    if (typeof price === 'string') {
      // Remove caracteres não numéricos exceto ponto e vírgula
      const cleanPrice = price.replace(/[^\d.,]/g, '').replace(',', '.');
      this.price = parseFloat(cleanPrice) || 0;
    } else {
      this.price = Number(price) || 0;
    }
    return this;
  }

  /**
   * Define dados a partir de um objeto genérico
   */
  fromObject(data: any): ProductBuilder {
    if (data.id !== undefined) this.setId(data.id);
    if (data.name !== undefined) this.setName(data.name);
    if (data.price !== undefined) this.setPrice(data.price);
    return this;
  }

  /**
   * Constrói o objeto Product
   */
  build(): Product {
    if (!this.id) {
      throw new Error('Product ID is required');
    }
    if (!this.name) {
      throw new Error('Product name is required');
    }
    
    return new Product(this.id, this.name, this.price);
  }

  /**
   * Reseta o builder para reutilização
   */
  reset(): ProductBuilder {
    this.id = '';
    this.name = '';
    this.price = 0;
    return this;
  }

  /**
   * Clona as configurações atuais do builder
   */
  clone(): ProductBuilder {
    return new ProductBuilder()
      .setId(this.id)
      .setName(this.name)
      .setPrice(this.price);
  }
}