"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
/**
 * Configurações centralizadas da aplicação
 * Implementa um padrão Singleton-like para configurações
 */
var Config = /** @class */ (function () {
    function Config() {
        // Configurações de salvamento
        this.storage = {
            resumesDir: './resumes',
            maxFileSize: '10mb'
        };
        // Configurações de logging
        this.logging = {
            level: process.env.LOG_LEVEL || 'info'
        };
        // Construtor privado para implementar singleton pattern
    }
    /**
     * Obtém a instância única da configuração
     */
    Config.getInstance = function () {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    };
    /**
     * Valida se as configurações estão corretas
     */
    Config.prototype.validate = function () {
        var errors = [];
        if (!this.storage.resumesDir || this.storage.resumesDir.trim() === '') {
            errors.push('Diretório de currículos não pode ser vazio');
        }
        return {
            valid: errors.length === 0,
            errors: errors
        };
    };
    /**
     * Exibe as configurações atuais (para debug)
     */
    Config.prototype.toString = function () {
        return JSON.stringify({
            storage: this.storage,
            logging: this.logging
        }, null, 2);
    };
    return Config;
}());
exports.Config = Config;
