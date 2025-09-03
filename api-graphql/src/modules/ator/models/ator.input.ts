import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AtorInput {
  @Field()
  nome!: string;

  @Field({ nullable: true })
  dataNascimento?: string;
}
