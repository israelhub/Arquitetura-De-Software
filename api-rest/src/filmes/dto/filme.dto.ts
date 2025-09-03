export class CreateFilmeDto {
  titulo: string;
  anoLancamento: number;
  generoId: number;
  atoresIds: number[];
}

export class UpdateFilmeDto {
  titulo?: string;
  anoLancamento?: number;
  generoId?: number;
  atoresIds?: number[];
}

export class AddAtorToFilmeDto {
  atorId: number;
}
