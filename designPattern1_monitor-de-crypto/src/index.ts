import * as readline from 'readline';
import { MonitorBuilder } from './monitor/CryptoMonitor';
import { AppConfig } from './config/AppConfig';
import { POPULAR_COINS, CryptoMonitorError, IObserver, IPriceUpdateEvent, IMonitorEvent } from './types';

/**
 * Aplicação principal do Crypto Monitor
 * Implementa Command Pattern para lidar com comandos do usuário
 */
export class CryptoApp implements IObserver<IPriceUpdateEvent | IMonitorEvent> {
  private readonly rl: readline.Interface;
  private monitor: any = null;
  private readonly config: AppConfig;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.config = AppConfig.getInstance();
  }

  /**
   * Inicia a aplicação
   */
  public async start(): Promise<void> {
    try {
      console.log('Crypto Monitor v2.0');
      console.log('Desenvolvido com TypeScript e Design Patterns\n');
      
      // Carrega configuração
      this.config.load();
      
      // Pergunta pela moeda
      const coin = await this.askForCoin();
      
      // Cria monitor usando builder pattern
      this.monitor = new MonitorBuilder()
        .setCoin(coin)
        .setupApi()
        .setupAlerts()
        .build();

      // Se registra como observador do monitor
      this.monitor.addObserver(this);
      
      // Mostra preço atual da moeda escolhida
      await this.showCurrentPrice(coin);
      
      // Inicia monitoramento
      await this.monitor.start();
      
      // Interface de comandos
      this.setupCommands();
      
    } catch (error) {
      if (error instanceof CryptoMonitorError) {
        console.error(`Erro: ${error.message}`);
        if (error.context) {
          console.error('Contexto:', error.context);
        }
      } else {
        console.error('Erro na inicialização:', error instanceof Error ? error.message : error);
      }
      process.exit(1);
    }
  }

  /**
   * Recebe atualizações do monitor (Observer Pattern)
   */
  public update(data: IPriceUpdateEvent | IMonitorEvent): void {
    if ('price' in data) {
      // É um evento de atualização de preço
      this.handlePriceUpdate(data);
    } else {
      // É um evento do monitor
      this.handleMonitorEvent(data);
    }
  }

  /**
   * Lida com atualizações de preço
   */
  private handlePriceUpdate(event: IPriceUpdateEvent): void {
    if (event.previousPrice) {
        const variation = ((event.price - event.previousPrice) / event.previousPrice) * 100;
        if (Math.abs(variation) > 0.1) { // Só mostra se variação > 0.1%
          const arrow = variation > 0 ? 'UP' : 'DOWN';
          console.log(`${arrow} ${event.coin.toUpperCase()}: $${event.price.toFixed(6)} (${variation > 0 ? '+' : ''}${variation.toFixed(2)}%)`);
        }
    }
  }

  /**
   * Lida com eventos do monitor
   */
  private handleMonitorEvent(event: IMonitorEvent): void {
    switch (event.type) {
      case 'started':
        console.log(`Monitoramento iniciado para ${event.data?.coin?.toUpperCase()}`);
        break;
      case 'stopped':
        console.log(`Monitoramento parado. Duração: ${this.formatDuration(event.data?.duration || 0)}`);
        break;
      case 'error':
        console.log(`Erro no monitoramento: ${event.data?.error?.message}`);
        break;
      case 'coin_changed':
        console.log(`Moeda alterada: ${event.data?.from?.toUpperCase()} → ${event.data?.to?.toUpperCase()}`);
        break;
    }
  }

  /**
   * Pergunta ao usuário qual moeda monitorar
   */
  private async askForCoin(): Promise<string> {
    const defaultCoin = this.config.get('defaultCoin');
    
    console.log('\nMoedas populares disponíveis:');
    this.displayCoinsInColumns();
    
    console.log(`\nMoeda padrão: ${defaultCoin}`);
    console.log('Nota: Use apenas o ID da moeda (ex: bitcoin, ethereum, solana)');
    
    return new Promise((resolve) => {
      this.rl.question('\nDigite a moeda ou Enter para usar a padrão: ', (input) => {
        resolve(input.trim() || defaultCoin);
      });
    });
  }

  /**
   * Exibe moedas em formato de colunas
   */
  private displayCoinsInColumns(): void {
    const coinsWithFormat = POPULAR_COINS.map(coin => `${coin.id} (${coin.symbol})`);
    
    for (let i = 0; i < coinsWithFormat.length; i += 3) {
      const row = coinsWithFormat.slice(i, i + 3);
      console.log('   ' + row.map(coin => coin.padEnd(22)).join(' '));
    }
  }

  /**
   * Mostra o preço atual da moeda
   */
  private async showCurrentPrice(coin: string): Promise<void> {
    try {
      console.log(`\nBuscando preço atual de ${coin.toUpperCase()}...`);
      const currentPrice = await this.monitor.apiService.getPrice(coin);
      console.log(`Preço atual: ${currentPrice.formatPrice()}`);
    } catch (error) {
      console.log(`Não foi possível obter o preço atual: ${error instanceof Error ? error.message : error}`);
    }
  }

  /**
   * Configura os comandos da interface
   */
  private setupCommands(): void {
    console.log('\nComandos disponíveis:');
    console.log('   "troca"  - trocar moeda monitorada');
    console.log('   "stats"  - ver estatísticas');
    console.log('   "status" - ver status do monitor');
    console.log('   "help"   - mostrar ajuda');
    console.log('   "sair"   - encerrar programa\\n');
    
    this.rl.on('line', async (input) => {
      const command = input.trim().toLowerCase();
      await this.executeCommand(command);
    });
  }

  /**
   * Executa comandos do usuário (Command Pattern)
   */
  private async executeCommand(command: string): Promise<void> {
    const commands: Record<string, () => Promise<void> | void> = {
      'sair': () => this.exit(),
      'exit': () => this.exit(),
      'troca': () => this.changeCoin(),
      'trocar': () => this.changeCoin(),
      'stats': () => this.showStats(),
      'estatisticas': () => this.showStats(),
      'status': () => this.showStatus(),
      'help': () => this.showHelp(),
      'ajuda': () => this.showHelp()
    };

    const commandFn = commands[command];
    if (commandFn) {
      try {
        await commandFn();
      } catch (error) {
        console.error(`Erro ao executar comando: ${error instanceof Error ? error.message : error}`);
      }
    } else if (command) {
      console.log('Comando não reconhecido. Digite "help" para ver comandos disponíveis.');
    }
  }

  /**
   * Troca a moeda monitorada
   */
  private async changeCoin(): Promise<void> {
    console.log('\\nMoedas populares disponíveis:');
    this.displayCoinsInColumns();
    
    console.log('\\nNota: Use apenas o ID da moeda (ex: bitcoin, ethereum, solana)');
    
    return new Promise((resolve) => {
      this.rl.question('\\nNova moeda: ', async (coin) => {
        if (coin.trim()) {
          try {
            // Testa se a moeda existe
            await this.monitor.apiService.getPrice(coin.trim());
            this.monitor.changeCoin(coin.trim());
            console.log(`Moeda alterada para: ${coin.trim().toUpperCase()}`);
          } catch (error) {
            console.error(`Erro: ${error instanceof Error ? error.message : error}`);
          }
        }
        resolve();
      });
    });
  }

  /**
   * Mostra estatísticas do monitoramento
   */
  private showStats(): void {
    const stats = this.monitor.getStats();
    if (!stats) {
      console.log('Nenhum dado disponível ainda.');
      return;
    }

    console.log('\\nEstatísticas de Preço:');
    console.log(`   Moeda: ${stats.coin.toUpperCase()}`);
    console.log(`   Atual: ${stats.current}`);
    console.log(`   Máximo: ${stats.max}`);
    console.log(`   Mínimo: ${stats.min}`);
    console.log(`   Amostras: ${stats.samples}\\n`);
  }

  /**
   * Mostra status do monitor
   */
  private showStatus(): void {
    const status = this.monitor.getStatus();
    
    console.log('\\nStatus do Monitor:');
    console.log(`   Estado: ${status.state}`);
    console.log(`   Moeda: ${status.coin.toUpperCase()}`);
    console.log(`   Intervalo: ${status.interval / 1000}s`);
    console.log(`   Tempo ativo: ${this.formatDuration(status.uptime)}`);
    console.log(`   Verificações: ${status.stats.totalChecks}`);
    console.log(`   Erros: ${status.stats.errorsCount}`);
    
    if (status.stats.lastError) {
      console.log(`   Último erro: ${status.stats.lastError.message}`);
    }
    
    console.log();
  }

  /**
   * Mostra ajuda
   */
  private showHelp(): void {
    console.log('\\nComandos Disponíveis:');
    console.log('   troca    - trocar a moeda monitorada');
    console.log('   stats    - mostrar estatísticas de preço');
    console.log('   status   - mostrar status do sistema');
    console.log('   help     - mostrar esta ajuda');
    console.log('   sair     - encerrar o programa\\n');
    
    console.log('Recursos:');
    console.log('   • Alertas automáticos por threshold e variação');
    console.log('   • Monitoramento em tempo real');
    console.log('   • Histórico de preços');
    console.log('   • Rate limiting automático\\n');
  }

  /**
   * Encerra a aplicação
   */
  private exit(): void {
    console.log('\\nEncerrando...');
    
    if (this.monitor) {
      this.monitor.stop();
      this.monitor.removeObserver(this);
    }
    
    this.rl.close();
    console.log('Obrigado por usar o Crypto Monitor!');
    process.exit(0);
  }

  /**
   * Formata duração em formato legível
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
}

// Tratamento de sinais do sistema
process.on('SIGINT', () => {
  console.log('\\nInterrupção detectada.');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Promise rejeitada:', reason);
  process.exit(1);
});

// Inicia aplicação se executado diretamente
if (require.main === module) {
  const app = new CryptoApp();
  app.start().catch(error => {
    console.error('Falha crítica na inicialização:', error);
    process.exit(1);
  });
}