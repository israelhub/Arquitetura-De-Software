// Interfaces para a API de criptomoedas
export interface ICryptoPrice {
  coin: string;
  price: number;
  timestamp: Date;
}

export interface ICryptoApiProvider {
  getPrice(coin: string): Promise<ICryptoPrice>;
}

export interface IApiConfig {
  provider: string;
  baseUrl: string;
  apiKey?: string;
}

// Interfaces para alertas
export interface IAlert {
  type: string;
  message: string;
  price: number;
  coin: string;
  timestamp: Date;
  format(): string;
  toEvent(): IAlertEvent;
}

export interface IAlertStrategy {
  check(currentPrice: ICryptoPrice, priceHistory: ICryptoPrice[]): IAlert | null;
}

export interface IAlertManager {
  addStrategy(name: string, strategy: IAlertStrategy): IAlertManager;
  checkAlerts(currentPrice: ICryptoPrice, priceHistory: ICryptoPrice[]): IAlert[];
}

// Interfaces para configuração
export interface IThresholdConfig {
  mode: 'dynamic' | 'static';
  buyPercentage: number;
  sellPercentage: number;
  staticPrices: Record<string, {
    buyPrice: number;
    sellPrice: number;
  }>;
}

export interface IVariationConfig {
  percentage: number;
  timeWindowMinutes: number;
}

export interface IAlertsConfig {
  threshold: IThresholdConfig;
  variation: IVariationConfig;
}

export interface IAppConfig {
  defaultCoin: string;
  refreshInterval: number;
  alerts: IAlertsConfig;
  api: IApiConfig;
}

// Interfaces para monitor
export interface ICryptoMonitor {
  coin: string;
  interval: number;
  start(): Promise<void>;
  stop(): void;
  changeCoin(newCoin: string): void;
  getStats(): IMonitorStats | null;
}

export interface IMonitorBuilder {
  setCoin(coin: string): IMonitorBuilder;
  setInterval(interval: number): IMonitorBuilder;
  setupApi(): IMonitorBuilder;
  setupAlerts(): IMonitorBuilder;
  build(): ICryptoMonitor;
}

export interface IMonitorStats {
  coin: string;
  current: string;
  max: string;
  min: string;
  samples: number;
}

// Observer Pattern interfaces
export interface IObserver<T> {
  update(data: T): void;
}

export interface IObservable<T> {
  addObserver(observer: IObserver<T>): void;
  removeObserver(observer: IObserver<T>): void;
  notifyObservers(data: T): void;
}

// Factory interfaces
export interface IAlertStrategyFactory {
  createThreshold(config: IThresholdConfig, coin: string): IAlertStrategy;
  createVariation(config: IVariationConfig): IAlertStrategy;
}

export interface ICryptoApiFactory {
  createProvider(config: IApiConfig): ICryptoApiProvider;
}

// Events
export interface IPriceUpdateEvent {
  coin: string;
  price: number;
  timestamp: Date;
  previousPrice?: number;
}

export interface IAlertEvent {
  alert: IAlert;
  triggeredAt: Date;
}

export interface IMonitorEvent {
  type: 'started' | 'stopped' | 'error' | 'coin_changed';
  data?: any;
  timestamp: Date;
}