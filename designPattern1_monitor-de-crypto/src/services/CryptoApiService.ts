import fetch from 'node-fetch';
import { ICryptoPrice, ICryptoApiProvider, IApiConfig, ApiError, DEFAULT_CONFIG } from '../types';

/**
 * Representa o preço de uma criptomoeda em um momento específico
 */
export class CryptoPrice implements ICryptoPrice {
  public readonly coin: string;
  public readonly price: number;
  public readonly timestamp: Date;

  constructor(coin: string, price: number, timestamp: Date = new Date()) {
    this.coin = coin;
    this.price = price;
    this.timestamp = timestamp;
  }

  /**
   * Formata o preço para exibição
   */
  public formatPrice(decimals: number = 6): string {
    return `$${this.price.toFixed(decimals)}`;
  }

  /**
   * Calcula a variação percentual entre dois preços
   */
  public calculateVariation(otherPrice: ICryptoPrice): number {
    if (otherPrice.price === 0) return 0;
    return ((this.price - otherPrice.price) / otherPrice.price) * 100;
  }
}

/**
 * Factory para criar providers de API específicos
 * Implementa o padrão Factory Method
 */
export class CryptoApiFactory {
  public static createProvider(config: IApiConfig): ICryptoApiProvider {
    switch (config.provider.toLowerCase()) {
      case 'coingecko':
        return new CoinGeckoProvider(config);
      case 'binance':
        // Placeholder para futura implementação
        throw new ApiError('Provider Binance ainda não implementado');
      case 'coinbase':
        // Placeholder para futura implementação
        throw new ApiError('Provider Coinbase ainda não implementado');
      default:
        throw new ApiError(`Provider não suportado: ${config.provider}`);
    }
  }
}

/**
 * Service principal para interação com APIs de criptomoedas
 * Implementa o padrão Adapter para diferentes providers
 */
export class CryptoApiService {
  private readonly provider: ICryptoApiProvider;
  private readonly config: IApiConfig;

  constructor(config: IApiConfig) {
    this.config = config;
    this.provider = CryptoApiFactory.createProvider(config);
  }

  /**
   * Obtém o preço atual de uma criptomoeda
   */
  public async getPrice(coin: string): Promise<ICryptoPrice> {
    try {
      return await this.provider.getPrice(coin);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Erro ao obter preço de ${coin}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        { coin, originalError: error }
      );
    }
  }

  /**
   * Obtém preços de múltiplas moedas
   */
  public async getPrices(coins: string[]): Promise<ICryptoPrice[]> {
    const promises = coins.map(coin => this.getPrice(coin));
    return Promise.all(promises);
  }
}

/**
 * Implementação específica para o provider CoinGecko
 * Implementa rate limiting e retry automático
 */
class CoinGeckoProvider implements ICryptoApiProvider {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private lastRequestTime: number = 0;
  private readonly minInterval: number = DEFAULT_CONFIG.MIN_API_INTERVAL;

  constructor(config: IApiConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
  }

  /**
   * Obtém o preço de uma moeda específica
   */
  public async getPrice(coin: string, retries: number = DEFAULT_CONFIG.RATE_LIMIT_RETRIES): Promise<ICryptoPrice> {
    // Rate limiting - aguarda se necessário
    await this.enforceRateLimit();

    try {
      const url = this.buildUrl(coin);
      this.lastRequestTime = Date.now();
      
      const response = await fetch(url);

      if (response.status === 429) {
        return this.handleRateLimit(coin, retries);
      }

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          { status: response.status, statusText: response.statusText }
        );
      }

      const data = await response.json() as Record<string, { usd: number }>;

      if (!data[coin]?.usd) {
        throw new ApiError(
          `Moeda '${coin}' não encontrada`,
          { coin, availableData: Object.keys(data) }
        );
      }

      return new CryptoPrice(coin, data[coin].usd);

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        `Erro na requisição: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        { coin, originalError: error }
      );
    }
  }

  /**
   * Constrói a URL da API com parâmetros adequados
   */
  private buildUrl(coin: string): string {
    let url = `${this.baseUrl}/simple/price?ids=${coin}&vs_currencies=usd`;
    
    if (this.apiKey) {
      url += `&x_cg_demo_api_key=${this.apiKey}`;
    }
    
    return url;
  }

  /**
   * Aplica rate limiting entre requisições
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minInterval) {
      await this.sleep(this.minInterval - timeSinceLastRequest);
    }
  }

  /**
   * Lida com rate limiting da API
   */
  private async handleRateLimit(coin: string, retries: number): Promise<ICryptoPrice> {
    if (retries <= 0) {
      throw new ApiError(
        'Rate limit excedido após várias tentativas',
        { coin, retriesAttempted: DEFAULT_CONFIG.RATE_LIMIT_RETRIES }
      );
    }

    const delay = (DEFAULT_CONFIG.RATE_LIMIT_RETRIES - retries + 1) * 2000; // 2s, 4s, 6s
    await this.sleep(delay);
    
    return this.getPrice(coin, retries - 1);
  }

  /**
   * Utilitário para pausar execução
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}