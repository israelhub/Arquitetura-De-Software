/**
 * Gerenciador de configurações usando o padrão Singleton
 * Centraliza todas as configurações da aplicação
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private config: Map<string, any> = new Map();

  private constructor() {
    this.initializeDefaultConfig();
  }

  /**
   * Retorna a instância única do ConfigManager (Singleton)
   */
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * Inicializa configurações padrão
   */
  private initializeDefaultConfig(): void {
    this.config.set('supportedFormats', ['json', 'csv', 'xml']);
    this.config.set('defaultFormat', 'json');
    this.config.set('encoding', 'utf-8');
    this.config.set('outputFormat', 'json');
    this.config.set('validateProducts', true);
    this.config.set('maxFileSize', 10 * 1024 * 1024); // 10MB
    this.config.set('logLevel', 'info');
  }

  /**
   * Obtém um valor de configuração
   */
  get<T>(key: string): T | undefined {
    return this.config.get(key);
  }

  /**
   * Define um valor de configuração
   */
  set<T>(key: string, value: T): void {
    this.config.set(key, value);
  }

  /**
   * Verifica se uma configuração existe
   */
  has(key: string): boolean {
    return this.config.has(key);
  }

  /**
   * Remove uma configuração
   */
  delete(key: string): boolean {
    return this.config.delete(key);
  }

  /**
   * Obtém todas as configurações
   */
  getAll(): Record<string, any> {
    const result: Record<string, any> = {};
    for (const [key, value] of this.config.entries()) {
      result[key] = value;
    }
    return result;
  }

  /**
   * Carrega configurações de um objeto
   */
  loadFromObject(configObject: Record<string, any>): void {
    for (const [key, value] of Object.entries(configObject)) {
      this.config.set(key, value);
    }
  }

  /**
   * Reseta todas as configurações para os valores padrão
   */
  reset(): void {
    this.config.clear();
    this.initializeDefaultConfig();
  }

  /**
   * Clona as configurações atuais
   */
  clone(): Record<string, any> {
    return this.getAll();
  }

  /**
   * Validação específica para formatos suportados
   */
  isSupportedFormat(format: string): boolean {
    const supportedFormats = this.get<string[]>('supportedFormats') || [];
    return supportedFormats.includes(format.toLowerCase());
  }

  /**
   * Obtém o formato padrão
   */
  getDefaultFormat(): string {
    return this.get<string>('defaultFormat') || 'json';
  }

  /**
   * Obtém a codificação padrão
   */
  getEncoding(): string {
    return this.get<string>('encoding') || 'utf-8';
  }

  /**
   * Verifica se a validação de produtos está habilitada
   */
  isValidationEnabled(): boolean {
    return this.get<boolean>('validateProducts') ?? true;
  }

  /**
   * Obtém o tamanho máximo de arquivo permitido
   */
  getMaxFileSize(): number {
    return this.get<number>('maxFileSize') || 10 * 1024 * 1024;
  }
}