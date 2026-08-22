import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  CreatePaisDto,
  PaisResponseDto,
  QueryPaisDto,
  UpdatePaisDto,
} from '../dtos';
import { PaisService } from '../services';

@Controller('identificacion/paises')
export class PaisController {
  constructor(private readonly paisService: PaisService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreatePaisDto,
  ): Promise<PaisResponseDto> {
    return this.paisService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryPaisDto,
  ): Promise<PaisResponseDto[]> {
    return this.paisService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<PaisResponseDto> {
    return this.paisService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdatePaisDto,
  ): Promise<PaisResponseDto> {
    return this.paisService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.paisService.delete(id);
  }
}
