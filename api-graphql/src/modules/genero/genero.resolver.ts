import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Genero } from './models/genero.model';
import { GeneroRepository } from './genero.repository';
import { GeneroInput } from './models/genero.input';
import { Filme } from '../filme/models/filme.model';
import { FilmeRepository } from '../filme/filme.repository';

@Resolver(() => Genero)
export class GeneroResolver {
  constructor(private readonly repo: GeneroRepository, private readonly filmeRepo: FilmeRepository) {}

  @Query(() => [Genero])
  generos() { return this.repo.findAll(); }

  @Query(() => Genero, { nullable: true })
  genero(@Args('id') id: string) { return this.repo.findById(id); }

  @Mutation(() => Genero)
  criarGenero(@Args('input') input: GeneroInput) { return this.repo.create(input); }

  @ResolveField(() => [Filme], { nullable: 'itemsAndList' })
  filmes(@Parent() genero: Genero): Filme[] {
    if (!genero.filmesIds) return [];
  return this.filmeRepo.findAll().filter((f: Filme) => genero.filmesIds?.includes(f.id));
  }
}
