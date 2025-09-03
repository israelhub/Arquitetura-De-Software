import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FilmeInput {
  @Field()
  titulo!: string;

  @Field({ nullable: true })
  ano?: number;
}
