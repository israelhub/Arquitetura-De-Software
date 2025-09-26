"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resume = void 0;
/**
 * Classe principal que representa um currículo
 */
var Resume = /** @class */ (function () {
    function Resume() {
        this._name = '';
        this._contact = '';
        this._experiences = [];
        this._education = [];
    }
    Object.defineProperty(Resume.prototype, "name", {
        // Getters
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resume.prototype, "contact", {
        get: function () {
            return this._contact;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resume.prototype, "experiences", {
        get: function () {
            return __spreadArray([], this._experiences, true); // Retorna cópia para evitar mutações externas
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Resume.prototype, "education", {
        get: function () {
            return __spreadArray([], this._education, true); // Retorna cópia para evitar mutações externas
        },
        enumerable: false,
        configurable: true
    });
    // Setters (usados pelo Builder)
    Resume.prototype.setName = function (name) {
        this._name = name;
    };
    Resume.prototype.setContact = function (contact) {
        this._contact = contact;
    };
    Resume.prototype.addExperience = function (experience) {
        this._experiences.push(experience);
    };
    Resume.prototype.addEducation = function (education) {
        this._education.push(education);
    };
    /**
     * Converte o currículo para formato de texto simples
     */
    Resume.prototype.toText = function () {
        var text = "CURRICULO\n";
        text += "=========\n\n";
        text += "Nome: ".concat(this._name, "\n");
        text += "Contato: ".concat(this._contact, "\n\n");
        if (this._experiences.length > 0) {
            text += "EXPERIENCIA PROFISSIONAL\n";
            text += "------------------------\n";
            this._experiences.forEach(function (exp, index) {
                text += "".concat(index + 1, ". ").concat(exp.position, " - ").concat(exp.company, " (").concat(exp.period, ")\n");
            });
            text += "\n";
        }
        if (this._education.length > 0) {
            text += "FORMACAO ACADEMICA\n";
            text += "------------------\n";
            this._education.forEach(function (edu, index) {
                text += "".concat(index + 1, ". ").concat(edu.degree, " - ").concat(edu.institution, " (").concat(edu.period, ")\n");
            });
            text += "\n";
        }
        return text;
    };
    /**
     * Converte o currículo para formato JSON
     */
    Resume.prototype.toJSON = function () {
        return {
            name: this._name,
            contact: this._contact,
            experiences: this._experiences,
            education: this._education,
            createdAt: new Date().toISOString()
        };
    };
    /**
     * Valida se o currículo tem os dados mínimos necessários
     */
    Resume.prototype.isValid = function () {
        return this._name.trim() !== '' && this._contact.trim() !== '';
    };
    return Resume;
}());
exports.Resume = Resume;
