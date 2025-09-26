/**
 * Configurações centralizadas da aplicação
 * Implementa um padrão Singleton-like para configurações
 */
export class Config {
  private static instance: Config;

  // Configurações de salvamento
  public readonly storage = {
    resumesDir: './resumes',
    maxFileSize: '10mb'
  };

  // Configurações de logging
  public readonly logging = {
    level: process.env.LOG_LEVEL || 'info'
  };

  private constructor() {
    // Construtor privado para implementar singleton pattern
  }

  /**
   * Obtém a instância única da configuração
   */
  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  /**
   * Valida se as configurações estão corretas
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.storage.resumesDir || this.storage.resumesDir.trim() === '') {
      errors.push('Diretório de currículos não pode ser vazio');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Exibe as configurações atuais (para debug)
   */
  toString(): string {
    return JSON.stringify({
      storage: this.storage,
      logging: this.logging
    }, null, 2);
  }
}
