import { 
  IAlert, 
  IAlertStrategy, 
  IAlertManager, 
  ICryptoPrice, 
  IThresholdConfig, 
  IVariationConfig,
  IObserver,
  IObservable,
  IAlertEvent,
  AlertType
} from '../types';

/**
 * Representa um alerta gerado pelo sistema
 */
export class Alert implements IAlert {
  public readonly type: string;
  public readonly message: string;
  public readonly price: number;
  public readonly coin: string;
  public readonly timestamp: Date;

  constructor(type: string, message: string, price: number, coin: string) {
    this.type = type;
    this.message = message;
    this.price = price;
    this.coin = coin;
    this.timestamp = new Date();
  }

  /**
   * Formata o alerta para exibição
   */
  public format(): string {
    const time = this.timestamp.toLocaleTimeString();
    return `[${time}] ${this.type}: ${this.message}`;
  }

  /**
   * Converte para evento
   */
  public toEvent(): IAlertEvent {
    return {
      alert: this,
      triggeredAt: this.timestamp
    };
  }
}

/**
 * Gerenciador de alertas implementando Observer Pattern
 * Permite que múltiplos observadores sejam notificados quando alertas são gerados
 */
export class AlertManager implements IAlertManager, IObservable<IAlertEvent> {
  private readonly strategies = new Map<string, IAlertStrategy>();
  private readonly observers: IObserver<IAlertEvent>[] = [];
  private readonly history: IAlert[] = [];

  /**
   * Adiciona uma estratégia de alerta
   */
  public addStrategy(name: string, strategy: IAlertStrategy): IAlertManager {
    this.strategies.set(name, strategy);
    return this;
  }

  /**
   * Remove uma estratégia de alerta
   */
  public removeStrategy(name: string): boolean {
    return this.strategies.delete(name);
  }

  /**
   * Verifica todas as estratégias e retorna alertas gerados
   */
  public checkAlerts(currentPrice: ICryptoPrice, priceHistory: ICryptoPrice[]): IAlert[] {
    const alerts: IAlert[] = [];

    for (const [name, strategy] of this.strategies) {
      try {
        const alert = strategy.check(currentPrice, priceHistory);
        if (alert) {
          alerts.push(alert);
          this.history.push(alert);
          this.notifyObservers(alert.toEvent());
        }
      } catch (error) {
        console.error(`Erro na estratégia ${name}:`, error instanceof Error ? error.message : error);
      }
    }

    return alerts;
  }

  /**
   * Adiciona um observador para receber notificações de alertas
   */
  public addObserver(observer: IObserver<IAlertEvent>): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  /**
   * Remove um observador
   */
  public removeObserver(observer: IObserver<IAlertEvent>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Notifica todos os observadores sobre um novo alerta
   */
  public notifyObservers(data: IAlertEvent): void {
    for (const observer of this.observers) {
      try {
        observer.update(data);
      } catch (error) {
        console.error('Erro ao notificar observador:', error);
      }
    }
  }

  /**
   * Retorna o histórico de alertas
   */
  public getHistory(): IAlert[] {
    return [...this.history]; // Retorna cópia para evitar mutação
  }

  /**
   * Limpa o histórico de alertas
   */
  public clearHistory(): void {
    this.history.length = 0;
  }

  /**
   * Retorna estatísticas dos alertas
   */
  public getStats(): { total: number; byType: Record<string, number> } {
    const byType: Record<string, number> = {};
    
    for (const alert of this.history) {
      byType[alert.type] = (byType[alert.type] || 0) + 1;
    }

    return {
      total: this.history.length,
      byType
    };
  }
}

/**
 * Estratégia de alerta baseada em thresholds (limites de preço)
 * Implementa o padrão Strategy
 */
export class ThresholdAlertStrategy implements IAlertStrategy {
  private readonly config: IThresholdConfig;
  private readonly coin: string;
  private currentState: 'neutral' | 'below_buy' | 'above_sell' = 'neutral';
  private buyPrice: number | null = null;
  private sellPrice: number | null = null;
  private isInitialized: boolean = false;

  constructor(config: IThresholdConfig, coin: string) {
    this.config = config;
    this.coin = coin;
  }

  /**
   * Verifica se deve gerar um alerta baseado nos thresholds
   */
  public check(currentPrice: ICryptoPrice, priceHistory: ICryptoPrice[]): IAlert | null {
    this.initializeThresholds(currentPrice);

    const price = currentPrice.price;
    const previousState = this.currentState;

    // Determina o estado atual baseado no preço
    this.updateCurrentState(price);

    // Só dispara alerta se houve mudança de estado
    if (this.currentState !== previousState) {
      return this.generateAlert(currentPrice);
    }

    return null;
  }

  /**
   * Inicializa os thresholds na primeira execução
   */
  private initializeThresholds(currentPrice: ICryptoPrice): void {
    if (this.isInitialized) return;

    const price = currentPrice.price;

    if (this.config.mode === 'dynamic') {
      this.buyPrice = price * (1 + this.config.buyPercentage / 100);
      this.sellPrice = price * (1 + this.config.sellPercentage / 100);
    } else {
      const staticPrices = this.config.staticPrices[this.coin];
      if (staticPrices) {
        this.buyPrice = staticPrices.buyPrice;
        this.sellPrice = staticPrices.sellPrice;
      } else {
        // Fallback para modo dinâmico
        this.buyPrice = price * 0.95;
        this.sellPrice = price * 1.05;
      }
    }

    this.isInitialized = true;
    console.log(`Thresholds configurados para ${this.coin.toUpperCase()}: Compra ≤ $${this.buyPrice!.toFixed(6)} | Venda ≥ $${this.sellPrice!.toFixed(6)}`);
  }

  /**
   * Atualiza o estado atual baseado no preço
   */
  private updateCurrentState(price: number): void {
    if (this.buyPrice && price <= this.buyPrice) {
      this.currentState = 'below_buy';
    } else if (this.sellPrice && price >= this.sellPrice) {
      this.currentState = 'above_sell';
    } else {
      this.currentState = 'neutral';
    }
  }

  /**
   * Gera o alerta apropriado baseado no estado atual
   */
  private generateAlert(currentPrice: ICryptoPrice): IAlert | null {
    const price = currentPrice.price;

    if (this.currentState === 'below_buy' && this.buyPrice) {
      return new Alert(
        AlertType.COMPRA,
        `OPORTUNIDADE DE COMPRA! ${currentPrice.coin.toUpperCase()} caiu para $${price.toFixed(6)} (abaixo de $${this.buyPrice.toFixed(6)})`,
        price,
        currentPrice.coin
      );
    }

    if (this.currentState === 'above_sell' && this.sellPrice) {
      return new Alert(
        AlertType.VENDA,
        `OPORTUNIDADE DE VENDA! ${currentPrice.coin.toUpperCase()} subiu para $${price.toFixed(6)} (acima de $${this.sellPrice.toFixed(6)})`,
        price,
        currentPrice.coin
      );
    }

    return null;
  }
}

/**
 * Estratégia de alerta baseada em variação percentual
 * Implementa o padrão Strategy
 */
export class VariationAlertStrategy implements IAlertStrategy {
  private readonly percentage: number;
  private readonly timeWindow: number; // em millisegundos
  private lastAlertTime: Date | null = null;
  private lastAlertVariation: number = 0;

  constructor(config: IVariationConfig) {
    this.percentage = config.percentage;
    this.timeWindow = config.timeWindowMinutes * 60 * 1000;
  }

  /**
   * Verifica se deve gerar um alerta baseado na variação percentual
   */
  public check(currentPrice: ICryptoPrice, priceHistory: ICryptoPrice[]): IAlert | null {
    if (priceHistory.length < 2) return null;

    const basePrice = this.findPriceAtTime(priceHistory);
    if (!basePrice) return null;

    const variation = this.calculateVariation(currentPrice.price, basePrice.price);
    const absVariation = Math.abs(variation);

    if (this.shouldAlert(absVariation)) {
      this.lastAlertTime = new Date();
      this.lastAlertVariation = absVariation;

      return new Alert(
        AlertType.VARIACAO,
        `VARIAÇÃO SIGNIFICATIVA! ${currentPrice.coin.toUpperCase()} ${variation > 0 ? 'subiu' : 'caiu'} ${absVariation.toFixed(2)}% nos últimos ${this.timeWindow / 60000} minutos`,
        currentPrice.price,
        currentPrice.coin
      );
    }

    return null;
  }

  /**
   * Encontra o preço no tempo limite especificado
   */
  private findPriceAtTime(priceHistory: ICryptoPrice[]): ICryptoPrice | null {
    const now = Date.now();
    const timeThreshold = now - this.timeWindow;

    // Procura o preço mais próximo do tempo limite
    for (let i = priceHistory.length - 1; i >= 0; i--) {
      if (priceHistory[i].timestamp.getTime() <= timeThreshold) {
        return priceHistory[i];
      }
    }

    // Se não encontrou, usa o primeiro preço disponível
    return priceHistory[0];
  }

  /**
   * Calcula a variação percentual entre dois preços
   */
  private calculateVariation(currentPrice: number, basePrice: number): number {
    if (basePrice === 0) return 0;
    return ((currentPrice - basePrice) / basePrice) * 100;
  }

  /**
   * Determina se deve disparar um alerta
   */
  private shouldAlert(absVariation: number): boolean {
    const now = new Date();
    
    // Verifica se a variação é significativa
    if (absVariation < this.percentage) return false;

    // Evita spam de alertas
    if (this.lastAlertTime) {
      const timeSinceLastAlert = now.getTime() - this.lastAlertTime.getTime();
      if (timeSinceLastAlert < 60000) return false; // Mínimo 1 minuto entre alertas
    }

    // Só alerta se a variação é maior que a última
    return absVariation > this.lastAlertVariation;
  }
}

/**
 * Factory para criar estratégias de alerta
 * Implementa o padrão Factory Method
 */
export class AlertStrategyFactory {
  /**
   * Cria uma estratégia de threshold
   */
  public static createThreshold(config: IThresholdConfig, coin: string): IAlertStrategy {
    return new ThresholdAlertStrategy(config, coin);
  }

  /**
   * Cria uma estratégia de variação
   */
  public static createVariation(config: IVariationConfig): IAlertStrategy {
    return new VariationAlertStrategy(config);
  }

  /**
   * Cria múltiplas estratégias baseadas na configuração
   */
  public static createStrategies(
    alertsConfig: { threshold?: IThresholdConfig; variation?: IVariationConfig },
    coin: string
  ): Map<string, IAlertStrategy> {
    const strategies = new Map<string, IAlertStrategy>();

    if (alertsConfig.threshold) {
      strategies.set('threshold', this.createThreshold(alertsConfig.threshold, coin));
    }

    if (alertsConfig.variation) {
      strategies.set('variation', this.createVariation(alertsConfig.variation));
    }

    return strategies;
  }
}

/**
 * Observador simples para logging de alertas
 */
export class AlertLogger implements IObserver<IAlertEvent> {
  public update(data: IAlertEvent): void {
    console.log(`ALERT ${data.alert.format()}`);
  }
}

/**
 * Observador para salvar alertas em arquivo
 */
export class AlertFileLogger implements IObserver<IAlertEvent> {
  private readonly filePath: string;

  constructor(filePath: string = 'alerts.log') {
    this.filePath = filePath;
  }

  public update(data: IAlertEvent): void {
    const fs = require('fs');
    const logEntry = `${data.triggeredAt.toISOString()} - ${data.alert.format()}\n`;
    
    try {
      fs.appendFileSync(this.filePath, logEntry);
    } catch (error) {
      console.error('Erro ao salvar alerta em arquivo:', error);
    }
  }
}