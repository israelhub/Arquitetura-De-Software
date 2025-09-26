"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeBuilder = void 0;
var resume_1 = require("../models/resume");
/**
 * Implementação do padrão Builder para criar currículos
 * Permite construção fluente e validação passo a passo
 */
var ResumeBuilder = /** @class */ (function () {
    function ResumeBuilder() {
        this.resume = new resume_1.Resume();
    }
    /**
     * Define o nome do candidato
     * @param name Nome completo
     * @returns Builder instance para chamadas fluentes
     */
    ResumeBuilder.prototype.withName = function (name) {
        if (!name || name.trim() === '') {
            throw new Error('Nome não pode ser vazio');
        }
        this.resume.setName(name.trim());
        return this;
    };
    /**
     * Define as informações de contato
     * @param contact Email, telefone ou outras informações de contato
     * @returns Builder instance para chamadas fluentes
     */
    ResumeBuilder.prototype.withContact = function (contact) {
        if (!contact || contact.trim() === '') {
            throw new Error('Contato não pode ser vazio');
        }
        this.resume.setContact(contact.trim());
        return this;
    };
    /**
     * Adiciona uma experiência profissional
     * @param position Cargo/Posição
     * @param company Empresa
     * @param period Período (ex: "2020-2024", "Jan 2020 - Presente")
     * @returns Builder instance para chamadas fluentes
     */
    ResumeBuilder.prototype.addExperience = function (position, company, period) {
        if (!position || position.trim() === '') {
            throw new Error('Posição não pode ser vazia');
        }
        if (!company || company.trim() === '') {
            throw new Error('Empresa não pode ser vazia');
        }
        if (!period || period.trim() === '') {
            throw new Error('Período não pode ser vazio');
        }
        var experience = {
            position: position.trim(),
            company: company.trim(),
            period: period.trim()
        };
        this.resume.addExperience(experience);
        return this;
    };
    /**
     * Adiciona formação acadêmica
     * @param degree Curso/Grau (ex: "Bacharelado em Ciência da Computação")
     * @param institution Instituição de ensino
     * @param period Período (ex: "2016-2020")
     * @returns Builder instance para chamadas fluentes
     */
    ResumeBuilder.prototype.addEducation = function (degree, institution, period) {
        if (!degree || degree.trim() === '') {
            throw new Error('Grau/Curso não pode ser vazio');
        }
        if (!institution || institution.trim() === '') {
            throw new Error('Instituição não pode ser vazia');
        }
        if (!period || period.trim() === '') {
            throw new Error('Período não pode ser vazio');
        }
        var education = {
            degree: degree.trim(),
            institution: institution.trim(),
            period: period.trim()
        };
        this.resume.addEducation(education);
        return this;
    };
    /**
     * Constrói e retorna o currículo final
     * Realiza validações antes de retornar
     * @returns Resume instance validada
     */
    ResumeBuilder.prototype.build = function () {
        if (!this.resume.isValid()) {
            throw new Error('Currículo inválido: Nome e contato são obrigatórios');
        }
        // Retorna uma nova instância para evitar modificações externas
        var builtResume = new resume_1.Resume();
        builtResume.setName(this.resume.name);
        builtResume.setContact(this.resume.contact);
        this.resume.experiences.forEach(function (exp) { return builtResume.addExperience(exp); });
        this.resume.education.forEach(function (edu) { return builtResume.addEducation(edu); });
        return builtResume;
    };
    /**
     * Reseta o builder para criar um novo currículo
     * @returns Builder instance limpa
     */
    ResumeBuilder.prototype.reset = function () {
        this.resume = new resume_1.Resume();
        return this;
    };
    /**
     * Método estático para criar uma nova instância do builder
     * Útil para criar builders sem usar new
     */
    ResumeBuilder.create = function () {
        return new ResumeBuilder();
    };
    return ResumeBuilder;
}());
exports.ResumeBuilder = ResumeBuilder;
