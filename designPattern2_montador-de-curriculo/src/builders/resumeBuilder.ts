import { Resume, Experience, Education } from '../models/resume';

/**
 * Implementação do padrão Builder para criar currículos
 * Permite construção fluente e validação passo a passo
 */
export class ResumeBuilder {
  private resume: Resume;

  constructor() {
    this.resume = new Resume();
  }

  /**
   * Define o nome do candidato
   * @param name Nome completo
   * @returns Builder instance para chamadas fluentes
   */
  withName(name: string): ResumeBuilder {
    if (!name || name.trim() === '') {
      throw new Error('Nome não pode ser vazio');
    }
    this.resume.setName(name.trim());
    return this;
  }

  /**
   * Define as informações de contato
   * @param contact Email, telefone ou outras informações de contato
   * @returns Builder instance para chamadas fluentes
   */
  withContact(contact: string): ResumeBuilder {
    if (!contact || contact.trim() === '') {
      throw new Error('Contato não pode ser vazio');
    }
    this.resume.setContact(contact.trim());
    return this;
  }

  /**
   * Adiciona uma experiência profissional
   * @param position Cargo/Posição
   * @param company Empresa
   * @param period Período (ex: "2020-2024", "Jan 2020 - Presente")
   * @returns Builder instance para chamadas fluentes
   */
  addExperience(position: string, company: string, period: string): ResumeBuilder {
    if (!position || position.trim() === '') {
      throw new Error('Posição não pode ser vazia');
    }
    if (!company || company.trim() === '') {
      throw new Error('Empresa não pode ser vazia');
    }
    if (!period || period.trim() === '') {
      throw new Error('Período não pode ser vazio');
    }

    const experience: Experience = {
      position: position.trim(),
      company: company.trim(),
      period: period.trim()
    };

    this.resume.addExperience(experience);
    return this;
  }

  /**
   * Adiciona formação acadêmica
   * @param degree Curso/Grau (ex: "Bacharelado em Ciência da Computação")
   * @param institution Instituição de ensino
   * @param period Período (ex: "2016-2020")
   * @returns Builder instance para chamadas fluentes
   */
  addEducation(degree: string, institution: string, period: string): ResumeBuilder {
    if (!degree || degree.trim() === '') {
      throw new Error('Grau/Curso não pode ser vazio');
    }
    if (!institution || institution.trim() === '') {
      throw new Error('Instituição não pode ser vazia');
    }
    if (!period || period.trim() === '') {
      throw new Error('Período não pode ser vazio');
    }

    const education: Education = {
      degree: degree.trim(),
      institution: institution.trim(),
      period: period.trim()
    };

    this.resume.addEducation(education);
    return this;
  }

  /**
   * Constrói e retorna o currículo final
   * Realiza validações antes de retornar
   * @returns Resume instance validada
   */
  build(): Resume {
    if (!this.resume.isValid()) {
      throw new Error('Currículo inválido: Nome e contato são obrigatórios');
    }

    // Retorna uma nova instância para evitar modificações externas
    const builtResume = new Resume();
    builtResume.setName(this.resume.name);
    builtResume.setContact(this.resume.contact);
    
    this.resume.experiences.forEach(exp => builtResume.addExperience(exp));
    this.resume.education.forEach(edu => builtResume.addEducation(edu));

    return builtResume;
  }

  /**
   * Reseta o builder para criar um novo currículo
   * @returns Builder instance limpa
   */
  reset(): ResumeBuilder {
    this.resume = new Resume();
    return this;
  }

  /**
   * Método estático para criar uma nova instância do builder
   * Útil para criar builders sem usar new
   */
  static create(): ResumeBuilder {
    return new ResumeBuilder();
  }
}
