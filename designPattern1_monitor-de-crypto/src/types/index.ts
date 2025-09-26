// Re-export interfaces
export * from './interfaces';

// Re-export types and enums explicitly to avoid conflicts
export {
  AlertType,
  MonitorState,
  ApiProvider,
  AlertStrategyType,
  POPULAR_COINS,
  DEFAULT_CONFIG,
  CryptoMonitorError,
  ApiError,
  ConfigurationError
} from './types';

export type { CoinId, CoinSymbol, ValidatedConfig } from './types';