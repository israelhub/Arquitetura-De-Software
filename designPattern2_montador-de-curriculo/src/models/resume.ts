/**
 * Interface que representa uma experiência profissional
 */
export interface Experience {
  position: string;
  company: string;
  period: string;
}

/**
 * Interface que representa formação acadêmica
 */
export interface Education {
  degree: string;
  institution: string;
  period: string;
}

/**
 * Classe principal que representa um currículo
 */
export class Resume {
  private _name: string = '';
  private _contact: string = '';
  private _experiences: Experience[] = [];
  private _education: Education[] = [];

  constructor() {}

  // Getters
  get name(): string {
    return this._name;
  }

  get contact(): string {
    return this._contact;
  }

  get experiences(): Experience[] {
    return [...this._experiences]; // Retorna cópia para evitar mutações externas
  }

  get education(): Education[] {
    return [...this._education]; // Retorna cópia para evitar mutações externas
  }

  // Setters (usados pelo Builder)
  setName(name: string): void {
    this._name = name;
  }

  setContact(contact: string): void {
    this._contact = contact;
  }

  addExperience(experience: Experience): void {
    this._experiences.push(experience);
  }

  addEducation(education: Education): void {
    this._education.push(education);
  }

  /**
   * Converte o currículo para formato de texto simples
   */
  toText(): string {
    let text = `CURRICULO\n`;
    text += `=========\n\n`;
    text += `Nome: ${this._name}\n`;
    text += `Contato: ${this._contact}\n\n`;

    if (this._experiences.length > 0) {
      text += `EXPERIENCIA PROFISSIONAL\n`;
      text += `------------------------\n`;
      this._experiences.forEach((exp, index) => {
        text += `${index + 1}. ${exp.position} - ${exp.company} (${exp.period})\n`;
      });
      text += `\n`;
    }

    if (this._education.length > 0) {
      text += `FORMACAO ACADEMICA\n`;
      text += `------------------\n`;
      this._education.forEach((edu, index) => {
        text += `${index + 1}. ${edu.degree} - ${edu.institution} (${edu.period})\n`;
      });
      text += `\n`;
    }

    return text;
  }

  /**
   * Converte o currículo para formato JSON
   */
  toJSON(): any {
    return {
      name: this._name,
      contact: this._contact,
      experiences: this._experiences,
      education: this._education,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Valida se o currículo tem os dados mínimos necessários
   */
  isValid(): boolean {
    return this._name.trim() !== '' && this._contact.trim() !== '';
  }
}
