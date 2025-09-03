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
import { AtorService } from './ator.service';
import type { Ator } from './entities/ator.entity';
import { HateoasHelper, type HateoasResponse } from '../common/hateoas.helper';
import { CreateAtorDto, UpdateAtorDto } from './dto/ator.dto';

@Controller('atores')
export class AtorController {
  constructor(private readonly atorService: AtorService) {}

  @Get()
  findAll(): HateoasResponse<Ator[]> {
    const atores = this.atorService.findAll();
    return {
      data: atores,
      links: HateoasHelper.createAtoresCollectionLinks(),
    };
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): HateoasResponse<Ator> {
    const ator = this.atorService.findOne(id);
    return {
      data: ator,
      links: HateoasHelper.createAtorLinks(id),
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() atorData: CreateAtorDto): HateoasResponse<Ator> {
    const novoAtor = this.atorService.create(atorData);
    return {
      data: novoAtor,
      links: HateoasHelper.createAtorLinks(novoAtor.id),
    };
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() atorData: UpdateAtorDto,
  ): HateoasResponse<Ator> {
    const atorAtualizado = this.atorService.update(id, atorData);
    return {
      data: atorAtualizado,
      links: HateoasHelper.createAtorLinks(id),
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.atorService.remove(id);
  }
}
