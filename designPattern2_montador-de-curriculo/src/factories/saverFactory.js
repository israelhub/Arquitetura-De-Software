"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaverFactory = void 0;
var types_1 = require("../strategies/savers/types");
var localJsonSaver_1 = require("../strategies/savers/localJsonSaver");
var localTextSaver_1 = require("../strategies/savers/localTextSaver");
var compositeSaver_1 = require("../strategies/savers/compositeSaver");
/**
 * Factory Method para criar diferentes tipos de savers
 * Implementa o padrão Factory Method para abstrair a criação de strategies
 */
var SaverFactory = /** @class */ (function () {
    function SaverFactory() {
    }
    /**
     * Cria um saver baseado no tipo especificado
     */
    SaverFactory.createSaver = function (type, options) {
        switch (type) {
            case types_1.SaverType.LOCAL_JSON:
                return new localJsonSaver_1.LocalJsonSaver((options === null || options === void 0 ? void 0 : options.outputDir) || this.defaultOutputDir);
            case types_1.SaverType.LOCAL_TEXT:
                return new localTextSaver_1.LocalTextSaver((options === null || options === void 0 ? void 0 : options.outputDir) || this.defaultOutputDir);
            case types_1.SaverType.COMPOSITE:
                var savers = (options === null || options === void 0 ? void 0 : options.savers) || [];
                return new compositeSaver_1.CompositeSaver(savers);
            default:
                throw new Error("Tipo de saver n\u00E3o suportado: ".concat(type));
        }
    };
    /**
     * Cria um saver local JSON com configurações padrão
     */
    SaverFactory.createLocalJsonSaver = function (outputDir) {
        return this.createSaver(types_1.SaverType.LOCAL_JSON, { outputDir: outputDir });
    };
    /**
     * Cria um saver local de texto com configurações padrão
     */
    SaverFactory.createLocalTextSaver = function (outputDir) {
        return this.createSaver(types_1.SaverType.LOCAL_TEXT, { outputDir: outputDir });
    };
    /**
     * Cria um composite saver com savers locais (JSON + Texto)
     */
    SaverFactory.createLocalCompositeSaver = function (outputDir) {
        var jsonSaver = this.createLocalJsonSaver(outputDir);
        var textSaver = this.createLocalTextSaver(outputDir);
        return new compositeSaver_1.CompositeSaver([jsonSaver, textSaver]);
    };
    /**
     * Cria savers baseado em uma lista de tipos
     */
    SaverFactory.createMultipleSavers = function (types, options) {
        var _this = this;
        return types.map(function (type) { return _this.createSaver(type, options); });
    };
    /**
     * Cria um composite saver baseado em uma lista de tipos
     */
    SaverFactory.createCompositeSaverFromTypes = function (types, options) {
        var savers = this.createMultipleSavers(types, options);
        return new compositeSaver_1.CompositeSaver(savers);
    };
    /**
     * Lista todos os tipos de savers disponíveis
     */
    SaverFactory.getAvailableSaverTypes = function () {
        return Object.values(types_1.SaverType);
    };
    /**
     * Obtém descrições dos tipos de savers
     */
    SaverFactory.getSaverTypeDescriptions = function () {
        var _a;
        return _a = {},
            _a[types_1.SaverType.LOCAL_JSON] = 'Salva currículo em arquivo JSON local',
            _a[types_1.SaverType.LOCAL_TEXT] = 'Salva currículo em arquivo de texto local',
            _a[types_1.SaverType.COMPOSITE] = 'Combina múltiplos savers',
            _a;
    };
    SaverFactory.defaultOutputDir = './resumes';
    return SaverFactory;
}());
exports.SaverFactory = SaverFactory;
