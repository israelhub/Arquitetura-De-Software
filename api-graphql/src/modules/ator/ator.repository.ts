import { Injectable } from '@nestjs/common';
import { atores, filmes } from '../../store/data';
import { v4 as uuid } from 'uuid';
import { AtorInput } from './models/ator.input';

@Injectable()
export class AtorRepository {
  findAll() { return atores; }
  findById(id: string) { return atores.find(a => a.id === id); }
  create(input: AtorInput) {
    const novo = { id: uuid(), ...input, filmesIds: [] };
    atores.push(novo);
    return novo;
  }
  update(id: string, input: AtorInput) {
    const ator = this.findById(id);
    if (!ator) return null;
    Object.assign(ator, input);
    return ator;
  }
  delete(id: string) {
    const idx = atores.findIndex(a => a.id === id);
    if (idx >= 0) atores.splice(idx, 1);
  }
}
