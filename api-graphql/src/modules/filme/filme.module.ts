import { Module } from '@nestjs/common';
import { FilmeResolver } from './filme.resolver';
import { FilmeRepository } from './filme.repository';
import { AtorRepository } from '../ator/ator.repository';
import { GeneroRepository } from '../genero/genero.repository';

@Module({
  providers: [FilmeResolver, FilmeRepository, AtorRepository, GeneroRepository],
  exports: [FilmeRepository],
})
export class FilmeModule {}
