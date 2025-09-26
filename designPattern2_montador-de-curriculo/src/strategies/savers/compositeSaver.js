"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeSaver = void 0;
/**
 * Strategy Composite que permite salvar em múltiplos formatos simultaneamente
 * Implementa o padrão Composite para combinar várias strategies
 */
var CompositeSaver = /** @class */ (function () {
    function CompositeSaver(savers) {
        if (savers === void 0) { savers = []; }
        this.savers = savers;
    }
    /**
     * Adiciona um novo saver à lista
     */
    CompositeSaver.prototype.addSaver = function (saver) {
        this.savers.push(saver);
    };
    /**
     * Remove um saver da lista
     */
    CompositeSaver.prototype.removeSaver = function (saver) {
        var index = this.savers.indexOf(saver);
        if (index > -1) {
            this.savers.splice(index, 1);
        }
    };
    /**
     * Salva o currículo usando todos os savers configurados
     * Executa em paralelo para melhor performance
     */
    CompositeSaver.prototype.save = function (resume, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results, successResults_1, failedResults_1, totalSuccessful, totalFailed, total, consolidatedMessage_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.savers.length === 0) {
                            return [2 /*return*/, {
                                    success: false,
                                    message: 'Nenhum saver configurado no CompositeSaver'
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        promises = this.savers.map(function (saver) { return saver.save(resume, filename); });
                        return [4 /*yield*/, Promise.allSettled(promises)];
                    case 2:
                        results = _a.sent();
                        successResults_1 = [];
                        failedResults_1 = [];
                        results.forEach(function (result, index) {
                            if (result.status === 'fulfilled') {
                                if (result.value.success) {
                                    successResults_1.push(result.value);
                                }
                                else {
                                    failedResults_1.push(result.value);
                                }
                            }
                            else {
                                failedResults_1.push({
                                    success: false,
                                    message: "Saver ".concat(index + 1, " falhou: ").concat(result.reason)
                                });
                            }
                        });
                        totalSuccessful = successResults_1.length;
                        totalFailed = failedResults_1.length;
                        total = totalSuccessful + totalFailed;
                        consolidatedMessage_1 = "Salvamento consolidado: ".concat(totalSuccessful, "/").concat(total, " bem-sucedidos.");
                        if (successResults_1.length > 0) {
                            consolidatedMessage_1 += "\n\nSucessos:\n";
                            successResults_1.forEach(function (result, index) {
                                consolidatedMessage_1 += "".concat(index + 1, ". ").concat(result.message, "\n");
                            });
                        }
                        if (failedResults_1.length > 0) {
                            consolidatedMessage_1 += "\n\nFalhas:\n";
                            failedResults_1.forEach(function (result, index) {
                                consolidatedMessage_1 += "".concat(index + 1, ". ").concat(result.message, "\n");
                            });
                        }
                        return [2 /*return*/, {
                                success: totalSuccessful > 0, // Sucesso se pelo menos um salvou
                                message: consolidatedMessage_1,
                                data: {
                                    successful: successResults_1,
                                    failed: failedResults_1,
                                    summary: {
                                        total: total,
                                        successful: totalSuccessful,
                                        failed: totalFailed
                                    }
                                }
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Erro inesperado no CompositeSaver: ".concat(error_1 instanceof Error ? error_1.message : 'Erro desconhecido')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retorna a quantidade de savers configurados
     */
    CompositeSaver.prototype.getSaverCount = function () {
        return this.savers.length;
    };
    /**
     * Limpa todos os savers
     */
    CompositeSaver.prototype.clearSavers = function () {
        this.savers = [];
    };
    return CompositeSaver;
}());
exports.CompositeSaver = CompositeSaver;
