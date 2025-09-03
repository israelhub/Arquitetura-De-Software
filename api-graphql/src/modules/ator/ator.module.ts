import { Module } from '@nestjs/common';
import { AtorResolver } from './ator.resolver';
import { AtorRepository } from './ator.repository';
import { FilmeRepository } from '../filme/filme.repository';
import { FilmeModule } from '../filme/filme.module';

@Module({
  imports: [FilmeModule],
  providers: [AtorResolver, AtorRepository, FilmeRepository],
  exports: [AtorRepository],
})
export class AtorModule {}
