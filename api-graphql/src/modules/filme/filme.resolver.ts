import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { Filme } from './models/filme.model';
  import { FilmeRepository } from './filme.repository';
import { FilmeInput } from './models/filme.input';
import { Ator } from '../ator/models/ator.model';
import { Genero } from '../genero/models/genero.model';
import { AtorRepository } from '../ator/ator.repository';
import { GeneroRepository } from '../genero/genero.repository';

@Resolver(() => Filme)
export class FilmeResolver {
  constructor(
    private readonly repo: FilmeRepository,
    private readonly atorRepo: AtorRepository,
    private readonly generoRepo: GeneroRepository,
  ) {}

  @Query(() => [Filme])
  filmes() {
    return this.repo.findAll();
  }

  @Query(() => Filme, { nullable: true })
  filme(@Args('id') id: string) {
    return this.repo.findById(id);
  }

  @Mutation(() => Filme)
  criarFilme(@Args('input') input: FilmeInput) {
    return this.repo.create(input);
  }

  @Mutation(() => Filme)
  atualizarFilme(@Args('id') id: string, @Args('input') input: FilmeInput) {
    return this.repo.update(id, input);
  }

  @Mutation(() => Boolean)
  excluirFilme(@Args('id') id: string) {
    this.repo.delete(id);
    return true;
  }

  @Mutation(() => Filme)
  adicionarAtoresEmFilme(@Args('filmeId') filmeId: string, @Args({ name: 'atorIds', type: () => [String] }) atorIds: string[]) {
    return this.repo.addAtores(filmeId, atorIds);
  }

  @Mutation(() => Filme)
  removerAtorDeFilme(@Args('filmeId') filmeId: string, @Args('atorId') atorId: string) {
    return this.repo.removeAtor(filmeId, atorId);
  }

  @Mutation(() => Filme)
  adicionarGenerosEmFilme(@Args('filmeId') filmeId: string, @Args({ name: 'generoIds', type: () => [String] }) generoIds: string[]) {
    return this.repo.addGeneros(filmeId, generoIds);
  }

  @ResolveField(() => [Ator], { nullable: 'itemsAndList' })
  atores(@Parent() filme: Filme): Ator[] {
    if (!filme.atoresIds) return [];
  return this.atorRepo.findAll().filter((a: Ator) => filme.atoresIds?.includes(a.id));
  }

  @ResolveField(() => [Genero], { nullable: 'itemsAndList' })
  generos(@Parent() filme: Filme): Genero[] {
    if (!filme.generosIds) return [];
  return this.generoRepo.findAll().filter((g: Genero) => filme.generosIds?.includes(g.id));
  }
}
