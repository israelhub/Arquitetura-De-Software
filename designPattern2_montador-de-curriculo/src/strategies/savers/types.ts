import { Resume } from '../../models/resume';

/**
 * Interface Strategy para diferentes formas de salvar currículos
 */
export interface ResumeSaver {
  save(resume: Resume, filename?: string): Promise<SaveResult>;
}

/**
 * Resultado de uma operação de salvamento
 */
export interface SaveResult {
  success: boolean;
  message: string;
  path?: string;
  data?: any;
}

/**
 * Enum com os tipos de salvamento disponíveis
 */
export enum SaverType {
  LOCAL_JSON = 'local-json',
  LOCAL_TEXT = 'local-text',
  COMPOSITE = 'composite'
}
