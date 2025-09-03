import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilmeService } from './filme.service';
import type { Filme } from './entities/filme.entity';
import { HateoasHelper, type HateoasResponse } from '../common/hateoas.helper';
import {
  CreateFilmeDto,
  UpdateFilmeDto,
  AddAtorToFilmeDto,
} from './dto/filme.dto';

@Controller('filmes')
export class FilmeController {
  constructor(private readonly filmeService: FilmeService) {}

  @Get()
  findAll(): HateoasResponse<Filme[]> {
    const filmes = this.filmeService.findAll();
    return {
      data: filmes,
      links: HateoasHelper.createFilmesCollectionLinks(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): HateoasResponse<Filme> {
    const filme = this.filmeService.findOne(id);
    return {
      data: filme,
      links: HateoasHelper.createFilmeLinks(id),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() filmeData: CreateFilmeDto): HateoasResponse<Filme> {
    const novoFilme = this.filmeService.create(filmeData);
    return {
      data: novoFilme,
      links: HateoasHelper.createFilmeLinks(novoFilme.id),
    };
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() filmeData: UpdateFilmeDto,
  ): HateoasResponse<Filme> {
    const filmeAtualizado = this.filmeService.update(id, filmeData);
    return {
      data: filmeAtualizado,
      links: HateoasHelper.createFilmeLinks(id),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.filmeService.remove(id);
  }

  @Get(':id/atores')
  findAtores(@Param('id', ParseIntPipe) id: number) {
    const atores = this.filmeService.findAtoresByFilmeId(id);
    return {
      data: atores,
      links: [
        { rel: 'self', href: `/filmes/${id}/atores`, method: 'GET' },
        { rel: 'filme', href: `/filmes/${id}`, method: 'GET' },
        { rel: 'add-ator', href: `/filmes/${id}/atores`, method: 'POST' },
      ],
    };
  }

  @Post(':filmeId/atores')
  @HttpCode(HttpStatus.CREATED)
  addAtor(
    @Param('filmeId', ParseIntPipe) filmeId: number,
    @Body() body: AddAtorToFilmeDto,
  ) {
    this.filmeService.addAtorToFilme(filmeId, body.atorId);
    return {
      message: 'Ator adicionado ao filme com sucesso',
      links: [
        { rel: 'filme', href: `/filmes/${filmeId}`, method: 'GET' },
        {
          rel: 'atores-filme',
          href: `/filmes/${filmeId}/atores`,
          method: 'GET',
        },
        { rel: 'ator', href: `/atores/${body.atorId}`, method: 'GET' },
      ],
    };
  }
}
