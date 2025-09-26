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
exports.ResumeCLI = void 0;
var inquirer_1 = require("inquirer");
var resumeBuilder_1 = require("../builders/resumeBuilder");
var saverFactory_1 = require("../factories/saverFactory");
var types_1 = require("../strategies/savers/types");
var config_1 = require("../config/config");
/**
 * Interface de linha de comando interativa para criar currículos
 * Coleta dados em etapas e usa o padrão Builder
 */
var ResumeCLI = /** @class */ (function () {
    function ResumeCLI() {
        this.config = config_1.Config.getInstance();
        this.builder = new resumeBuilder_1.ResumeBuilder();
    }
    /**
     * Inicia a aplicação CLI
     */
    ResumeCLI.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var action, _a, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log('Bem-vindo ao Criador de Currículos!');
                        console.log('===================================');
                        console.log();
                        _b.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 10];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 8, , 9]);
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'list',
                                    name: 'action',
                                    message: 'O que você gostaria de fazer?',
                                    choices: [
                                        { name: 'Criar novo currículo', value: 'create' },
                                        { name: 'Sair', value: 'exit' }
                                    ]
                                }
                            ])];
                    case 3:
                        action = (_b.sent()).action;
                        _a = action;
                        switch (_a) {
                            case 'create': return [3 /*break*/, 4];
                            case 'exit': return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.createResume()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        console.log('Obrigado por usar o Criador de Currículos!');
                        return [2 /*return*/];
                    case 7:
                        console.log();
                        return [3 /*break*/, 9];
                    case 8:
                        error_1 = _b.sent();
                        console.error('Erro inesperado:', error_1 instanceof Error ? error_1.message : 'Erro desconhecido');
                        console.log();
                        return [3 /*break*/, 9];
                    case 9: return [3 /*break*/, 1];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Processo principal de criação de currículo
     */
    ResumeCLI.prototype.createResume = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resume, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Vamos criar seu currículo passo a passo...');
                        console.log();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        // Reset do builder para novo currículo
                        this.builder.reset();
                        // Coleta dados básicos
                        return [4 /*yield*/, this.collectBasicInfo()];
                    case 2:
                        // Coleta dados básicos
                        _a.sent();
                        // Coleta experiências profissionais
                        return [4 /*yield*/, this.collectExperiences()];
                    case 3:
                        // Coleta experiências profissionais
                        _a.sent();
                        // Coleta formação acadêmica
                        return [4 /*yield*/, this.collectEducation()];
                    case 4:
                        // Coleta formação acadêmica
                        _a.sent();
                        resume = this.builder.build();
                        // Exibe preview
                        console.log('Preview do seu currículo:');
                        console.log('-'.repeat(50));
                        console.log(resume.toText());
                        console.log('-'.repeat(50));
                        // Pergunta sobre salvamento
                        return [4 /*yield*/, this.handleSaving(resume)];
                    case 5:
                        // Pergunta sobre salvamento
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error('Erro ao criar currículo:', error_2 instanceof Error ? error_2.message : 'Erro desconhecido');
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Coleta informações básicas
     */
    ResumeCLI.prototype.collectBasicInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var basicInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'name',
                                message: 'Qual é o seu nome completo?',
                                validate: function (input) {
                                    if (!input || input.trim() === '') {
                                        return 'Nome é obrigatório';
                                    }
                                    return true;
                                }
                            },
                            {
                                type: 'input',
                                name: 'contact',
                                message: 'Qual é o seu contato (email, telefone, etc.)?',
                                validate: function (input) {
                                    if (!input || input.trim() === '') {
                                        return 'Contato é obrigatório';
                                    }
                                    return true;
                                }
                            }
                        ])];
                    case 1:
                        basicInfo = _a.sent();
                        this.builder.withName(basicInfo.name).withContact(basicInfo.contact);
                        console.log('Informações básicas adicionadas!');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Coleta experiências profissionais
     */
    ResumeCLI.prototype.collectExperiences = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addMore, wantToAdd, experience;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Agora vamos adicionar suas experiências profissionais...');
                        addMore = true;
                        _a.label = 1;
                    case 1:
                        if (!addMore) return [3 /*break*/, 4];
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'confirm',
                                    name: 'wantToAdd',
                                    message: 'Deseja adicionar uma experiência profissional?',
                                    default: true
                                }
                            ])];
                    case 2:
                        wantToAdd = (_a.sent()).wantToAdd;
                        if (!wantToAdd) {
                            addMore = false;
                            return [3 /*break*/, 1];
                        }
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'position',
                                    message: 'Cargo/Posição:',
                                    validate: function (input) { return input.trim() !== '' || 'Cargo é obrigatório'; }
                                },
                                {
                                    type: 'input',
                                    name: 'company',
                                    message: 'Empresa:',
                                    validate: function (input) { return input.trim() !== '' || 'Empresa é obrigatória'; }
                                },
                                {
                                    type: 'input',
                                    name: 'period',
                                    message: 'Período (ex: 2020-2024, Jan 2020 - Presente):',
                                    validate: function (input) { return input.trim() !== '' || 'Período é obrigatório'; }
                                }
                            ])];
                    case 3:
                        experience = _a.sent();
                        this.builder.addExperience(experience.position, experience.company, experience.period);
                        console.log('Experiência adicionada!');
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Coleta formação acadêmica
     */
    ResumeCLI.prototype.collectEducation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var addMore, wantToAdd, education;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Agora vamos adicionar sua formação acadêmica...');
                        addMore = true;
                        _a.label = 1;
                    case 1:
                        if (!addMore) return [3 /*break*/, 4];
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'confirm',
                                    name: 'wantToAdd',
                                    message: 'Deseja adicionar uma formação acadêmica?',
                                    default: true
                                }
                            ])];
                    case 2:
                        wantToAdd = (_a.sent()).wantToAdd;
                        if (!wantToAdd) {
                            addMore = false;
                            return [3 /*break*/, 1];
                        }
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'degree',
                                    message: 'Curso/Grau (ex: Bacharelado em Ciência da Computação):',
                                    validate: function (input) { return input.trim() !== '' || 'Curso é obrigatório'; }
                                },
                                {
                                    type: 'input',
                                    name: 'institution',
                                    message: 'Instituição:',
                                    validate: function (input) { return input.trim() !== '' || 'Instituição é obrigatória'; }
                                },
                                {
                                    type: 'input',
                                    name: 'period',
                                    message: 'Período (ex: 2016-2020):',
                                    validate: function (input) { return input.trim() !== '' || 'Período é obrigatório'; }
                                }
                            ])];
                    case 3:
                        education = _a.sent();
                        this.builder.addEducation(education.degree, education.institution, education.period);
                        console.log('Formação adicionada!');
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gerencia o processo de salvamento
     */
    ResumeCLI.prototype.handleSaving = function (resume) {
        return __awaiter(this, void 0, void 0, function () {
            var saveOptions, customFilename, filename, saverTypes, saver, result, compositeSaver, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'checkbox',
                                name: 'saveOptions',
                                message: 'Como você gostaria de salvar o currículo?',
                                choices: [
                                    { name: 'Arquivo de texto (.txt)', value: 'text', checked: true },
                                    { name: 'Arquivo JSON (.json)', value: 'json', checked: true }
                                ],
                                validate: function (choices) {
                                    if (choices.length === 0) {
                                        return 'Selecione pelo menos uma opção de salvamento';
                                    }
                                    return true;
                                }
                            }
                        ])];
                    case 1:
                        saveOptions = (_a.sent()).saveOptions;
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'customFilename',
                                    message: 'Nome personalizado do arquivo (opcional, deixe vazio para gerar automaticamente):',
                                    default: ''
                                }
                            ])];
                    case 2:
                        customFilename = (_a.sent()).customFilename;
                        filename = customFilename.trim() || undefined;
                        saverTypes = [];
                        if (saveOptions.includes('text'))
                            saverTypes.push(types_1.SaverType.LOCAL_TEXT);
                        if (saveOptions.includes('json'))
                            saverTypes.push(types_1.SaverType.LOCAL_JSON);
                        if (!(saverTypes.length === 1)) return [3 /*break*/, 4];
                        saver = saverFactory_1.SaverFactory.createSaver(saverTypes[0]);
                        return [4 /*yield*/, saver.save(resume, filename)];
                    case 3:
                        result = _a.sent();
                        if (result.success) {
                            console.log('Sucesso:', result.message);
                        }
                        else {
                            console.log('Erro:', result.message);
                        }
                        return [3 /*break*/, 6];
                    case 4:
                        compositeSaver = saverFactory_1.SaverFactory.createCompositeSaverFromTypes(saverTypes);
                        return [4 /*yield*/, compositeSaver.save(resume, filename)];
                    case 5:
                        result = _a.sent();
                        console.log(result.success ? 'Sucesso:' : 'Aviso:', result.message);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return ResumeCLI;
}());
exports.ResumeCLI = ResumeCLI;
// Inicia a CLI se o arquivo for executado diretamente
if (require.main === module) {
    var cli = new ResumeCLI();
    cli.start().catch(function (error) {
        console.error('Erro fatal na CLI:', error);
        process.exit(1);
    });
}
