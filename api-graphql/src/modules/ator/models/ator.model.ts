import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Filme } from '../../filme/models/filme.model';

@ObjectType()
export class Ator {
  @Field(() => ID)
  id!: string;

  @Field()
  nome!: string;

  @Field({ nullable: true })
  dataNascimento?: string;

  filmesIds?: string[];

  @Field(() => [Filme], { nullable: 'itemsAndList' })
  filmes?: Filme[];
}
