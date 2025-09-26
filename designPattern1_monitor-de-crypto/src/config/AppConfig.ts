import * as fs from 'fs';
import * as path from 'path';
import { IAppConfig, ConfigurationError } from '../types';

/**
 * Singleton para gerenciar configurações da aplicação
 * Implementa o padrão Singleton para garantir uma única instância
 */
export class AppConfig {
  private static instance: AppConfig;
  private config: IAppConfig | null = null;
  private readonly configPath: string;

  private constructor() {
    this.configPath = path.join(process.cwd(), 'config.json');
  }

  /**
   * Retorna a instância única do AppConfig (Singleton Pattern)
   */
  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  /**
   * Carrega a configuração do arquivo JSON
   */
  public load(): void {
    try {
      if (!fs.existsSync(this.configPath)) {
        throw new ConfigurationError(
          `Arquivo de configuração não encontrado: ${this.configPath}`,
          { path: this.configPath }
        );
      }

      const configData = fs.readFileSync(this.configPath, 'utf8');
      this.config = JSON.parse(configData) as IAppConfig;
      
      this.validateConfig();
      
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      
      throw new ConfigurationError(
        `Erro ao carregar configuração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        { originalError: error }
      );
    }
  }

  /**
   * Valida se a configuração carregada está correta
   */
  private validateConfig(): void {
    if (!this.config) {
      throw new ConfigurationError('Configuração não foi carregada');
    }

    const requiredFields = ['defaultCoin', 'refreshInterval', 'alerts', 'api'];
    
    for (const field of requiredFields) {
      if (!(field in this.config)) {
        throw new ConfigurationError(
          `Campo obrigatório ausente na configuração: ${field}`,
          { missingField: field }
        );
      }
    }

    // Validações específicas
    if (this.config.refreshInterval < 1000) {
      throw new ConfigurationError(
        'refreshInterval deve ser pelo menos 1000ms para evitar rate limiting',
        { value: this.config.refreshInterval }
      );
    }

    if (!this.config.api.provider) {
      throw new ConfigurationError('Provider da API deve ser especificado');
    }

    if (!this.config.api.baseUrl) {
      throw new ConfigurationError('URL base da API deve ser especificada');
    }
  }

  /**
   * Retorna um valor da configuração
   */
  public get<K extends keyof IAppConfig>(key: K): IAppConfig[K] {
    if (!this.config) {
      throw new ConfigurationError('Configuração não foi carregada. Chame load() primeiro.');
    }
    
    return this.config[key];
  }

  /**
   * Atualiza um valor na configuração
   */
  public set<K extends keyof IAppConfig>(key: K, value: IAppConfig[K]): void {
    if (!this.config) {
      throw new ConfigurationError('Configuração não foi carregada. Chame load() primeiro.');
    }
    
    this.config[key] = value;
  }

  /**
   * Salva a configuração atual no arquivo
   */
  public save(): void {
    if (!this.config) {
      throw new ConfigurationError('Nenhuma configuração para salvar');
    }

    try {
      const configData = JSON.stringify(this.config, null, 2);
      fs.writeFileSync(this.configPath, configData, 'utf8');
    } catch (error) {
      throw new ConfigurationError(
        `Erro ao salvar configuração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        { originalError: error }
      );
    }
  }

  /**
   * Retorna toda a configuração
   */
  public getAll(): IAppConfig {
    if (!this.config) {
      throw new ConfigurationError('Configuração não foi carregada. Chame load() primeiro.');
    }
    
    // Retorna uma cópia para evitar mutações externas
    return { ...this.config };
  }

  /**
   * Reseta a instância (útil para testes)
   */
  public static reset(): void {
    AppConfig.instance = undefined as any;
  }
}