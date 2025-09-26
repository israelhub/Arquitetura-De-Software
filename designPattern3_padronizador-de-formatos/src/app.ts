import { ProductProviderFactory } from './factories/ProductProviderFactory';
import { ProductProcessor } from './strategies/ProductProcessor';
import { ValidationProcessingStrategy, SortingProcessingStrategy } from './strategies/ProcessingStrategies';
import { ConfigManager } from './config/ConfigManager';

/**
 * Aplicação principal que processa arquivos de produtos
 */
class ProductStandardizerApp {
  private configManager: ConfigManager;
  private processor: ProductProcessor;

  constructor() {
    this.configManager = ConfigManager.getInstance();
    this.processor = new ProductProcessor();
    this.setupDefaultProcessing();
  }

  /**
   * Configura o processamento padrão
   */
  private setupDefaultProcessing(): void {
    // Adiciona validação por padrão
    if (this.configManager.isValidationEnabled()) {
      this.processor.addStrategy(new ValidationProcessingStrategy());
    }
    
    // Adiciona ordenação por nome por padrão
    this.processor.addStrategy(new SortingProcessingStrategy('name', true));
  }

  /**
   * Processa o arquivo de produtos
   */
  async processFile(filePath: string, format?: string): Promise<void> {
    try {
      console.log(`Iniciando processamento do arquivo: ${filePath}`);
      
      // Detecta ou usa o formato especificado
      const detectedFormat = format || ProductProviderFactory.detectFormatFromFile(filePath);
      
      if (!detectedFormat) {
        throw new Error('Não foi possível detectar o formato do arquivo. Especifique usando --format=');
      }

      console.log(`Formato detectado/especificado: ${detectedFormat.toUpperCase()}`);

      // Cria o provider apropriado usando Factory Method
      const provider = ProductProviderFactory.createProvider(detectedFormat);
      
      // Carrega os produtos usando o Adapter
      console.log(`Carregando produtos do arquivo...`);
      const rawProducts = await provider.load(filePath);
      console.log(`${rawProducts.length} produtos carregados`);

      // Processa usando Strategy
      console.log(`Aplicando estratégias de processamento...`);
      const { result: processedProducts, log } = this.processor.processWithLog(rawProducts);
      
      // Exibe log do processamento
      log.forEach(entry => console.log(`  ${entry}`));

      // Exibe os produtos em formato JSON padronizado
      console.log(`\nProdutos padronizados:`);
      console.log(JSON.stringify(processedProducts.map(p => p.toJSON()), null, 2));

      console.log(`\nProcessamento concluído com sucesso!`);
      console.log(`Total final: ${processedProducts.length} produtos`);

    } catch (error) {
      console.error(`Erro durante o processamento: ${error}`);
      process.exit(1);
    }
  }

  /**
   * Processa argumentos da linha de comando
   */
  private parseArguments(): { input?: string; format?: string } {
    const args = process.argv.slice(2);
    const result: { input?: string; format?: string } = {};

    for (const arg of args) {
      if (arg.startsWith('--input=')) {
        result.input = arg.substring('--input='.length);
      } else if (arg === '--input') {
        const nextIndex = args.indexOf(arg) + 1;
        if (nextIndex < args.length) {
          result.input = args[nextIndex];
        }
      } else if (arg.startsWith('--format=')) {
        result.format = arg.substring('--format='.length);
      }
    }

    return result;
  }

  /**
   * Ponto de entrada da aplicação
   */
  async run(): Promise<void> {
    console.log('Product Standardizer v1.0.0\n');

    const { input, format } = this.parseArguments();

    if (!input) {
      console.error('Erro: Parâmetro --input é obrigatório');
      console.error('Uso: node dist/app.js --input <arquivo> [--format=<formato>]');
      process.exit(1);
    }

    await this.processFile(input, format);
  }
}

// Executa a aplicação
const app = new ProductStandardizerApp();
app.run().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});