import { Product } from '../models/Product';
import { IProcessingStrategy } from './ProcessingStrategies';

/**
 * Contexto que utiliza estratégias de processamento (Padrão Strategy)
 */
export class ProductProcessor {
  private strategies: IProcessingStrategy[] = [];

  /**
   * Adiciona uma estratégia de processamento
   */
  addStrategy(strategy: IProcessingStrategy): ProductProcessor {
    this.strategies.push(strategy);
    return this;
  }

  /**
   * Remove uma estratégia de processamento
   */
  removeStrategy(strategyName: string): ProductProcessor {
    this.strategies = this.strategies.filter(s => s.getName() !== strategyName);
    return this;
  }

  /**
   * Remove todas as estratégias
   */
  clearStrategies(): ProductProcessor {
    this.strategies = [];
    return this;
  }

  /**
   * Obtém a lista de estratégias ativas
   */
  getStrategies(): string[] {
    return this.strategies.map(s => s.getName());
  }

  /**
   * Processa a lista de produtos aplicando todas as estratégias em sequência
   */
  process(products: Product[]): Product[] {
    let result = [...products]; // Cria uma cópia para não modificar o original

    for (const strategy of this.strategies) {
      result = strategy.process(result);
    }

    return result;
  }

  /**
   * Processa produtos com logging
   */
  processWithLog(products: Product[]): { result: Product[], log: string[] } {
    let result = [...products];
    const log: string[] = [];

    log.push(`Iniciando processamento com ${products.length} produtos`);

    for (const strategy of this.strategies) {
      const beforeCount = result.length;
      result = strategy.process(result);
      const afterCount = result.length;
      
      log.push(`Estratégia '${strategy.getName()}': ${beforeCount} → ${afterCount} produtos`);
    }

    log.push(`Processamento concluído com ${result.length} produtos`);

    return { result, log };
  }

  /**
   * Verifica se há estratégias configuradas
   */
  hasStrategies(): boolean {
    return this.strategies.length > 0;
  }

  /**
   * Conta o número de estratégias ativas
   */
  getStrategyCount(): number {
    return this.strategies.length;
  }
}