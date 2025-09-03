import { Injectable } from '@nestjs/common';
import { filmes, atores, generos } from '../../store/data';
  import { FilmeInput } from './models/filme.input';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilmeRepository {
  findAll() {
    return filmes;
  }
  findById(id: string) {
    return filmes.find(f => f.id === id);
  }
  create(input: FilmeInput) {
    const novo = { id: uuid(), atoresIds: [], generosIds: [], ...input };
    filmes.push(novo);
    return novo;
  }
  update(id: string, input: FilmeInput) {
    const filme = this.findById(id);
    if (!filme) return null;
    Object.assign(filme, input);
    return filme;
  }
  delete(id: string) {
    const idx = filmes.findIndex(f => f.id === id);
    if (idx >= 0) filmes.splice(idx, 1);
  }
  addAtores(filmeId: string, atorIds: string[]) {
    const filme = this.findById(filmeId);
    if (!filme) return null;
    filme.atoresIds = Array.from(new Set([...(filme.atoresIds || []), ...atorIds]));
    return filme;
  }
  removeAtor(filmeId: string, atorId: string) {
    const filme = this.findById(filmeId);
    if (!filme) return null;
    filme.atoresIds = (filme.atoresIds || []).filter((id: string) => id !== atorId);
    return filme;
  }
  addGeneros(filmeId: string, generoIds: string[]) {
    const filme = this.findById(filmeId);
    if (!filme) return null;
    filme.generosIds = Array.from(new Set([...(filme.generosIds || []), ...generoIds]));
    return filme;
  }
}
