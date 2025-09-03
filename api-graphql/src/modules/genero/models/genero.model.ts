import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Filme } from '../../filme/models/filme.model';

@ObjectType()
export class Genero {
  @Field(() => ID)
  id!: string;

  @Field()
  nome!: string;

  filmesIds?: string[];

  @Field(() => [Filme], { nullable: 'itemsAndList' })
  filmes?: Filme[];
}
