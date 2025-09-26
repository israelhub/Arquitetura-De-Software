// Enums para tipos específicos
export enum AlertType {
  COMPRA = 'COMPRA',
  VENDA = 'VENDA',
  VARIACAO = 'VARIACAO',
  INFO = 'INFO'
}

export enum MonitorState {
  IDLE = 'idle',
  RUNNING = 'running',
  ERROR = 'error',
  STOPPED = 'stopped'
}

export enum ApiProvider {
  COINGECKO = 'coingecko',
  BINANCE = 'binance',
  COINBASE = 'coinbase'
}

export enum AlertStrategyType {
  THRESHOLD = 'threshold',
  VARIATION = 'variation',
  MOVING_AVERAGE = 'moving_average',
  CUSTOM = 'custom'
}

// Constants
export const POPULAR_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos' }
] as const;

export const DEFAULT_CONFIG = {
  DEFAULT_COIN: 'bitcoin',
  REFRESH_INTERVAL: 10000,
  MIN_API_INTERVAL: 1000,
  RATE_LIMIT_RETRIES: 3,
  HEARTBEAT_INTERVAL: 30000
} as const;

// Utility types
export type CoinId = typeof POPULAR_COINS[number]['id'];
export type CoinSymbol = typeof POPULAR_COINS[number]['symbol'];

// Configuration validation types
export type ValidatedConfig<T> = T & {
  __validated: true;
};

// Error types
export class CryptoMonitorError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, any>
  ) {
    super(message);
    this.name = 'CryptoMonitorError';
  }
}

export class ApiError extends CryptoMonitorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'API_ERROR', context);
    this.name = 'ApiError';
  }
}

export class ConfigurationError extends CryptoMonitorError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'CONFIG_ERROR', context);
    this.name = 'ConfigurationError';
  }
}