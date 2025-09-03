import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Ator } from '../../ator/models/ator.model';
import { Genero } from '../../genero/models/genero.model';

@ObjectType()
export class Filme {
  @Field(() => ID)
  id!: string;

  @Field()
  titulo!: string;

  @Field({ nullable: true })
  ano?: number;

  atoresIds?: string[];
  generosIds?: string[];

  @Field(() => [Ator], { nullable: 'itemsAndList' })
  atores?: Ator[];

  @Field(() => [Genero], { nullable: 'itemsAndList' })
  generos?: Genero[];
}
