import { Module } from '@nestjs/common';
import { GeneroResolver } from './genero.resolver';
import { GeneroRepository } from './genero.repository';
import { FilmeModule } from '../filme/filme.module';
import { FilmeRepository } from '../filme/filme.repository';

@Module({
  imports: [FilmeModule],
  providers: [GeneroResolver, GeneroRepository, FilmeRepository],
  exports: [GeneroRepository],
})
export class GeneroModule {}
