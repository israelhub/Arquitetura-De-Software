import { Product } from '../models/Product';

/**
 * Interface para estratégias de processamento de produtos
 */
export interface IProcessingStrategy {
  process(products: Product[]): Product[];
  getName(): string;
}

/**
 * Estratégia padrão - não faz modificações
 */
export class DefaultProcessingStrategy implements IProcessingStrategy {
  process(products: Product[]): Product[] {
    return products;
  }

  getName(): string {
    return 'default';
  }
}

/**
 * Estratégia de validação - remove produtos inválidos
 */
export class ValidationProcessingStrategy implements IProcessingStrategy {
  process(products: Product[]): Product[] {
    return products.filter(product => {
      try {
        // Valida se o produto atende aos critérios mínimos
        return product.id && 
               product.id.trim().length > 0 && 
               product.name && 
               product.name.trim().length > 0 && 
               product.price >= 0;
      } catch {
        return false;
      }
    });
  }

  getName(): string {
    return 'validation';
  }
}

/**
 * Estratégia de ordenação - ordena produtos por nome
 */
export class SortingProcessingStrategy implements IProcessingStrategy {
  private sortBy: 'name' | 'price' | 'id';
  private ascending: boolean;

  constructor(sortBy: 'name' | 'price' | 'id' = 'name', ascending: boolean = true) {
    this.sortBy = sortBy;
    this.ascending = ascending;
  }

  process(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
      }

      return this.ascending ? comparison : -comparison;
    });
  }

  getName(): string {
    return `sorting-${this.sortBy}-${this.ascending ? 'asc' : 'desc'}`;
  }
}

/**
 * Estratégia de filtragem - filtra produtos por critérios
 */
export class FilterProcessingStrategy implements IProcessingStrategy {
  private minPrice: number;
  private maxPrice: number;
  private nameFilter?: string;

  constructor(minPrice: number = 0, maxPrice: number = Number.MAX_VALUE, nameFilter?: string) {
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    this.nameFilter = nameFilter;
  }

  process(products: Product[]): Product[] {
    return products.filter(product => {
      // Filtro por preço
      if (product.price < this.minPrice || product.price > this.maxPrice) {
        return false;
      }

      // Filtro por nome (se especificado)
      if (this.nameFilter && !product.name.toLowerCase().includes(this.nameFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }

  getName(): string {
    return `filter-price-${this.minPrice}-${this.maxPrice}${this.nameFilter ? `-name-${this.nameFilter}` : ''}`;
  }
}

/**
 * Estratégia de deduplicação - remove produtos duplicados
 */
export class DeduplicationProcessingStrategy implements IProcessingStrategy {
  private deduplicateBy: 'id' | 'name' | 'all';

  constructor(deduplicateBy: 'id' | 'name' | 'all' = 'id') {
    this.deduplicateBy = deduplicateBy;
  }

  process(products: Product[]): Product[] {
    const uniqueProducts: Product[] = [];
    const seen = new Set<string>();

    for (const product of products) {
      let key: string;
      
      switch (this.deduplicateBy) {
        case 'id':
          key = product.id;
          break;
        case 'name':
          key = product.name.toLowerCase();
          break;
        case 'all':
          key = `${product.id}-${product.name.toLowerCase()}-${product.price}`;
          break;
      }

      if (!seen.has(key)) {
        seen.add(key);
        uniqueProducts.push(product);
      }
    }

    return uniqueProducts;
  }

  getName(): string {
    return `deduplication-${this.deduplicateBy}`;
  }
}