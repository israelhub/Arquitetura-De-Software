import { Injectable, NotFoundException } from '@nestjs/common';
import { Filme } from './entities/filme.entity';
import { filmes } from './filmes.repository';
import { atores } from '../atores/atores.repository';
import { Ator } from '../atores/entities/ator.entity';

@Injectable()
export class FilmeService {
  private filmes: Filme[] = filmes;

  findAll(): Filme[] {
    return this.filmes;
  }

  findOne(id: number): Filme {
    const filme = this.filmes.find((f) => f.id === id);
    if (!filme) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }
    return filme;
  }

  create(filmeData: Omit<Filme, 'id'>): Filme {
    const newId = Math.max(...this.filmes.map((f) => f.id), 0) + 1;
    const novoFilme: Filme = {
      id: newId,
      ...filmeData,
    };
    this.filmes.push(novoFilme);
    return novoFilme;
  }

  update(id: number, filmeData: Partial<Omit<Filme, 'id'>>): Filme {
    const filmeIndex = this.filmes.findIndex((f) => f.id === id);
    if (filmeIndex === -1) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }

    this.filmes[filmeIndex] = { ...this.filmes[filmeIndex], ...filmeData };
    return this.filmes[filmeIndex];
  }

  remove(id: number): void {
    const filmeIndex = this.filmes.findIndex((f) => f.id === id);
    if (filmeIndex === -1) {
      throw new NotFoundException(`Filme com ID ${id} não encontrado`);
    }
    this.filmes.splice(filmeIndex, 1);
  }

  findAtoresByFilmeId(filmeId: number): Ator[] {
    const filme = this.findOne(filmeId);
    return atores.filter((ator) => filme.atoresIds.includes(ator.id));
  }

  addAtorToFilme(filmeId: number, atorId: number): void {
    const filme = this.findOne(filmeId);
    const ator = atores.find((a) => a.id === atorId);

    if (!ator) {
      throw new NotFoundException(`Ator com ID ${atorId} não encontrado`);
    }

    if (!filme.atoresIds.includes(atorId)) {
      filme.atoresIds.push(atorId);
    }
  }
}
