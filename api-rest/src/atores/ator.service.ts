import { Injectable, NotFoundException } from '@nestjs/common';
import { Ator } from './entities/ator.entity';
import { atores } from './atores.repository';

@Injectable()
export class AtorService {
  private atores: Ator[] = atores;

  findAll(): Ator[] {
    return this.atores;
  }

  findOne(id: number): Ator {
    const ator = this.atores.find((a) => a.id === id);
    if (!ator) {
      throw new NotFoundException(`Ator com ID ${id} não encontrado`);
    }
    return ator;
  }

  create(atorData: Omit<Ator, 'id'>): Ator {
    const newId = Math.max(...this.atores.map((a) => a.id), 0) + 1;
    const novoAtor: Ator = {
      id: newId,
      ...atorData,
    };
    this.atores.push(novoAtor);
    return novoAtor;
  }

  update(id: number, atorData: Partial<Omit<Ator, 'id'>>): Ator {
    const atorIndex = this.atores.findIndex((a) => a.id === id);
    if (atorIndex === -1) {
      throw new NotFoundException(`Ator com ID ${id} não encontrado`);
    }

    this.atores[atorIndex] = { ...this.atores[atorIndex], ...atorData };
    return this.atores[atorIndex];
  }

  remove(id: number): void {
    const atorIndex = this.atores.findIndex((a) => a.id === id);
    if (atorIndex === -1) {
      throw new NotFoundException(`Ator com ID ${id} não encontrado`);
    }
    this.atores.splice(atorIndex, 1);
  }
}
