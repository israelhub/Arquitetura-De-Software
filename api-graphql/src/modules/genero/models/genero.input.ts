import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GeneroInput {
  @Field()
  nome!: string;
}
