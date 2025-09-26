import { 
  ICryptoMonitor, 
  IMonitorBuilder, 
  ICryptoPrice, 
  IMonitorStats,
  IObserver,
  IObservable,
  IPriceUpdateEvent,
  IMonitorEvent,
  MonitorState,
  DEFAULT_CONFIG
} from '../types';
import { AppConfig } from '../config/AppConfig';
import { CryptoApiService } from '../services/CryptoApiService';
import { AlertManager, AlertStrategyFactory, AlertLogger } from '../alerts/AlertSystem';

/**
 * Builder para configurar e criar instâncias do CryptoMonitor
 * Implementa o padrão Builder para construção complexa de objetos
 */
export class MonitorBuilder implements IMonitorBuilder {
  private readonly config: AppConfig;
  private _coin: string | null = null;
  private _interval: number | null = null;
  private _apiService: CryptoApiService | null = null;
  private _alertManager: AlertManager | null = null;

  constructor() {
    this.config = AppConfig.getInstance();
  }

  /**
   * Define a moeda a ser monitorada
   */
  public setCoin(coin: string): IMonitorBuilder {
    this._coin = coin;
    return this;
  }

  /**
   * Define o intervalo de atualização
   */
  public setInterval(interval: number): IMonitorBuilder {
    this._interval = interval;
    return this;
  }

  /**
   * Configura o serviço de API
   */
  public setupApi(): IMonitorBuilder {
    const apiConfig = this.config.get('api');
    this._apiService = new CryptoApiService(apiConfig);
    return this;
  }

  /**
   * Configura o sistema de alertas
   */
  public setupAlerts(): IMonitorBuilder {
    const alertsConfig = this.config.get('alerts');
    this._alertManager = new AlertManager();

    // Adiciona logger padrão
    this._alertManager.addObserver(new AlertLogger());

    // Cria estratégias baseadas na configuração
    const coin = this._coin || this.config.get('defaultCoin');
    const strategies = AlertStrategyFactory.createStrategies(alertsConfig, coin);

    strategies.forEach((strategy, name) => {
      this._alertManager!.addStrategy(name, strategy);
    });

    return this;
  }

  /**
   * Constrói e retorna a instância do monitor
   */
  public build(): ICryptoMonitor {
    const coin = this._coin || this.config.get('defaultCoin');
    const interval = this._interval || this.config.get('refreshInterval');

    if (!this._apiService) {
      this.setupApi();
    }

    if (!this._alertManager) {
      this.setupAlerts();
    }

    return new CryptoMonitor(
      coin,
      interval,
      this._apiService!,
      this._alertManager!
    );
  }

  /**
   * Reseta o builder para reutilização
   */
  public reset(): IMonitorBuilder {
    this._coin = null;
    this._interval = null;
    this._apiService = null;
    this._alertManager = null;
    return this;
  }
}

/**
 * Monitor principal de criptomoedas
 * Implementa os padrões Observer e State Machine
 */
export class CryptoMonitor implements ICryptoMonitor, IObservable<IPriceUpdateEvent | IMonitorEvent> {
  public coin: string;
  public readonly interval: number;
  public readonly apiService: CryptoApiService;
  
  private readonly alertManager: AlertManager;
  private readonly priceHistory: ICryptoPrice[] = [];
  private readonly observers: IObserver<IPriceUpdateEvent | IMonitorEvent>[] = [];
  
  private state: MonitorState = MonitorState.IDLE;
  private monitoringTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private checksWithoutVariation: number = 0;
  private isFirstCheck: boolean = true;
  
  // Estatísticas
  private stats = {
    startTime: null as Date | null,
    totalChecks: 0,
    errorsCount: 0,
    lastError: null as Error | null
  };

  constructor(
    coin: string,
    interval: number,
    apiService: CryptoApiService,
    alertManager: AlertManager
  ) {
    this.coin = coin;
    this.interval = interval;
    this.apiService = apiService;
    this.alertManager = alertManager;
  }

  /**
   * Inicia o monitoramento
   */
  public async start(): Promise<void> {
    if (this.state === MonitorState.RUNNING) {
      console.log('Monitor já está em execução');
      return;
    }

    console.log(`Iniciando monitoramento de ${this.coin.toUpperCase()}...`);
    
    this.setState(MonitorState.RUNNING);
    this.stats.startTime = new Date();
    this.stats.totalChecks = 0;
    this.stats.errorsCount = 0;

    // Primeira verificação imediata
    await this.checkPrice();

    // Configura monitoramento periódico
    this.monitoringTimer = setInterval(() => {
      this.checkPrice().catch(error => {
        console.error('Erro no monitoramento:', error.message);
      });
    }, this.interval);

    // Configura heartbeat
    this.heartbeatTimer = setInterval(() => {
      this.sendHeartbeat();
    }, DEFAULT_CONFIG.HEARTBEAT_INTERVAL);

    this.notifyObservers({
      type: 'started',
      data: { coin: this.coin, interval: this.interval },
      timestamp: new Date()
    });
  }

  /**
   * Para o monitoramento
   */
  public stop(): void {
    if (this.state === MonitorState.STOPPED) {
      console.log('Monitor já está parado');
      return;
    }

    console.log('Parando monitoramento...');
    
    this.setState(MonitorState.STOPPED);

    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.notifyObservers({
      type: 'stopped',
      data: { 
        duration: this.stats.startTime ? Date.now() - this.stats.startTime.getTime() : 0,
        totalChecks: this.stats.totalChecks,
        errors: this.stats.errorsCount
      },
      timestamp: new Date()
    });
  }

  /**
   * Troca a moeda sendo monitorada
   */
  public changeCoin(newCoin: string): void {
    const previousCoin = this.coin;
    this.coin = newCoin;
    
    // Limpa histórico anterior
    this.priceHistory.length = 0;
    this.checksWithoutVariation = 0;
    this.isFirstCheck = true;

    // Reconfigura alertas para a nova moeda
    this.reconfigureAlerts();

    console.log(`Moeda alterada de ${previousCoin.toUpperCase()} para ${newCoin.toUpperCase()}`);

    this.notifyObservers({
      type: 'coin_changed',
      data: { from: previousCoin, to: newCoin },
      timestamp: new Date()
    });
  }

  /**
   * Retorna estatísticas do monitoramento
   */
  public getStats(): IMonitorStats | null {
    if (this.priceHistory.length === 0) {
      return null;
    }

    const prices = this.priceHistory.map(p => p.price);
    const current = this.priceHistory[this.priceHistory.length - 1];

    return {
      coin: this.coin,
      current: `$${current.price.toFixed(6)}`,
      max: `$${Math.max(...prices).toFixed(6)}`,
      min: `$${Math.min(...prices).toFixed(6)}`,
      samples: this.priceHistory.length
    };
  }

  /**
   * Verifica o preço atual e processa alertas
   */
  private async checkPrice(): Promise<void> {
    try {
      this.stats.totalChecks++;
      const currentPrice = await this.apiService.getPrice(this.coin);
      
      // Adiciona ao histórico
      this.priceHistory.push(currentPrice);
      
      // Mantém apenas os últimos 100 preços para performance
      if (this.priceHistory.length > 100) {
        this.priceHistory.shift();
      }

      // Processa alertas
      const alerts = this.alertManager.checkAlerts(currentPrice, this.priceHistory);

      // Exibe preço na primeira verificação ou se houve alertas
      if (this.isFirstCheck || alerts.length > 0) {
        console.log(`${this.coin.toUpperCase()}: $${currentPrice.price.toFixed(6)}`);
        this.isFirstCheck = false;
      }

      // Notifica observadores sobre atualização de preço
      const previousPrice = this.priceHistory.length > 1 ? 
        this.priceHistory[this.priceHistory.length - 2] : undefined;

      this.notifyObservers({
        coin: currentPrice.coin,
        price: currentPrice.price,
        timestamp: currentPrice.timestamp,
        previousPrice: previousPrice?.price
      });

      // Atualiza contador de verificações sem variação
      if (alerts.length === 0) {
        this.checksWithoutVariation++;
      } else {
        this.checksWithoutVariation = 0;
      }

    } catch (error) {
      this.stats.errorsCount++;
      this.stats.lastError = error instanceof Error ? error : new Error(String(error));
      
      if (this.state === MonitorState.RUNNING) {
        this.setState(MonitorState.ERROR);
        
        console.error(`Erro ao verificar preço de ${this.coin}:`, error instanceof Error ? error.message : error);
        
        this.notifyObservers({
          type: 'error',
          data: { error: this.stats.lastError, coin: this.coin },
          timestamp: new Date()
        });

        // Tenta recuperar após erro
        setTimeout(() => {
          if (this.state === MonitorState.ERROR) {
            this.setState(MonitorState.RUNNING);
          }
        }, 5000);
      }
    }
  }

  /**
   * Envia heartbeat para indicar que o monitor está ativo
   */
  private sendHeartbeat(): void {
    if (this.state === MonitorState.RUNNING) {
      const stats = this.getStats();
      console.log(`HEARTBEAT Monitor ativo - ${this.coin.toUpperCase()} | ${stats ? stats.current : 'N/A'} | Verificações: ${this.stats.totalChecks}`);
    }
  }

  /**
   * Reconfigura alertas para a nova moeda
   */
  private reconfigureAlerts(): void {
    // Remove estratégias antigas
    const config = AppConfig.getInstance();
    const alertsConfig = config.get('alerts');

    // Recria estratégias para a nova moeda
    const strategies = AlertStrategyFactory.createStrategies(alertsConfig, this.coin);

    // Limpa estratégias antigas e adiciona novas
    // Nota: implementar método para limpar estratégias no AlertManager
    strategies.forEach((strategy, name) => {
      this.alertManager.removeStrategy(name);
      this.alertManager.addStrategy(name, strategy);
    });
  }

  /**
   * Atualiza o estado do monitor
   */
  private setState(newState: MonitorState): void {
    if (this.state !== newState) {
      const previousState = this.state;
      this.state = newState;
      console.log(`Estado do monitor: ${previousState} → ${newState}`);
    }
  }

  /**
   * Adiciona observador
   */
  public addObserver(observer: IObserver<IPriceUpdateEvent | IMonitorEvent>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Remove observador
   */
  public removeObserver(observer: IObserver<IPriceUpdateEvent | IMonitorEvent>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notifica todos os observadores
   */
  public notifyObservers(data: IPriceUpdateEvent | IMonitorEvent): void {
    for (const observer of this.observers) {
      try {
        observer.update(data);
      } catch (error) {
        console.error('Erro ao notificar observador:', error);
      }
    }
  }

  /**
   * Retorna informações sobre o estado atual
   */
  public getStatus(): {
    state: MonitorState;
    coin: string;
    interval: number;
    uptime: number;
    stats: {
      startTime: Date | null;
      totalChecks: number;
      errorsCount: number;
      lastError: Error | null;
    };
  } {
    return {
      state: this.state,
      coin: this.coin,
      interval: this.interval,
      uptime: this.stats.startTime ? Date.now() - this.stats.startTime.getTime() : 0,
      stats: { ...this.stats }
    };
  }
}