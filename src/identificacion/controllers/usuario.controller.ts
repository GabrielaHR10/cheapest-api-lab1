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
  CreateUsuarioDto,
  UsuarioResponseDto,
  QueryUsuarioDto,
  UpdateUsuarioDto,
} from '../dtos';
import { UsuarioService } from '../services';

@Controller('identificacion/usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    return this.usuarioService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryUsuarioDto,
  ): Promise<UsuarioResponseDto[]> {
    return this.usuarioService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UsuarioResponseDto> {
    return this.usuarioService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateUsuarioDto,
  ): Promise<UsuarioResponseDto> {
    return this.usuarioService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.usuarioService.delete(id);
  }
}
