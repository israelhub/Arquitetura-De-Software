/**
 * Modelo de produto padronizado
 */
export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number
  ) {
    this.validateProduct();
  }

  private validateProduct(): void {
    if (!this.id || this.id.trim().length === 0) {
      throw new Error('Product ID cannot be empty');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    if (this.price < 0) {
      throw new Error('Product price cannot be negative');
    }
  }

  /**
   * Converte o produto para JSON padronizado
   */
  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      price: this.price
    };
  }

  /**
   * Cria uma cópia do produto com novos valores
   */
  clone(updates: Partial<{id: string, name: string, price: number}>): Product {
    return new Product(
      updates.id ?? this.id,
      updates.name ?? this.name,
      updates.price ?? this.price
    );
  }
}