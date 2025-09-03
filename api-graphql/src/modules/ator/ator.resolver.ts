import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Ator } from './models/ator.model';
import { AtorRepository } from './ator.repository';
import { AtorInput } from './models/ator.input';
import { Filme } from '../filme/models/filme.model';
import { FilmeRepository } from '../filme/filme.repository';

@Resolver(() => Ator)
export class AtorResolver {
  constructor(private readonly repo: AtorRepository, private readonly filmeRepo: FilmeRepository) {}

  @Query(() => [Ator])
  atores() {
    return this.repo.findAll();
  }

  @Query(() => Ator, { nullable: true })
  ator(@Args('id') id: string) {
    return this.repo.findById(id);
  }

  @Mutation(() => Ator)
  criarAtor(@Args('input') input: AtorInput) {
    return this.repo.create(input);
  }

  @Mutation(() => Ator)
  atualizarAtor(@Args('id') id: string, @Args('input') input: AtorInput) {
    return this.repo.update(id, input);
  }

  @Mutation(() => Boolean)
  excluirAtor(@Args('id') id: string) {
    this.repo.delete(id);
    return true;
  }

  @ResolveField(() => [Filme], { nullable: 'itemsAndList' })
  filmes(@Parent() ator: Ator): Filme[] {
    if (!ator.filmesIds) return [];
  return this.filmeRepo.findAll().filter((f: Filme) => ator.filmesIds?.includes(f.id));
  }
}
