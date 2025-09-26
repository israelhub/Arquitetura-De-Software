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
exports.LocalJsonSaver = void 0;
var fs = require("fs/promises");
var path = require("path");
/**
 * Strategy para salvar currículos em formato JSON local
 */
var LocalJsonSaver = /** @class */ (function () {
    function LocalJsonSaver(outputDir) {
        if (outputDir === void 0) { outputDir = './resumes'; }
        this.outputDir = outputDir;
    }
    LocalJsonSaver.prototype.save = function (resume, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var fileName, filePath, jsonData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        // Garante que o diretório existe
                        return [4 /*yield*/, this.ensureDirectoryExists()];
                    case 1:
                        // Garante que o diretório existe
                        _a.sent();
                        fileName = filename || this.generateFileName(resume, 'json');
                        filePath = path.join(this.outputDir, fileName);
                        jsonData = JSON.stringify(resume.toJSON(), null, 2);
                        // Salva o arquivo
                        return [4 /*yield*/, fs.writeFile(filePath, jsonData, 'utf-8')];
                    case 2:
                        // Salva o arquivo
                        _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                message: "Curr\u00EDculo salvo em JSON: ".concat(filePath),
                                path: filePath,
                                data: resume.toJSON()
                            }];
                    case 3:
                        error_1 = _a.sent();
                        return [2 /*return*/, {
                                success: false,
                                message: "Erro ao salvar JSON: ".concat(error_1 instanceof Error ? error_1.message : 'Erro desconhecido')
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LocalJsonSaver.prototype.ensureDirectoryExists = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, fs.access(this.outputDir)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        _a = _b.sent();
                        return [4 /*yield*/, fs.mkdir(this.outputDir, { recursive: true })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LocalJsonSaver.prototype.generateFileName = function (resume, extension) {
        var safeName = resume.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        var timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        return "".concat(safeName, "_").concat(timestamp, ".").concat(extension);
    };
    /**
     * Lista todos os currículos JSON salvos
     */
    LocalJsonSaver.prototype.listSavedResumes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var files, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fs.readdir(this.outputDir)];
                    case 1:
                        files = _b.sent();
                        return [2 /*return*/, files.filter(function (file) { return file.endsWith('.json'); })];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return LocalJsonSaver;
}());
exports.LocalJsonSaver = LocalJsonSaver;
