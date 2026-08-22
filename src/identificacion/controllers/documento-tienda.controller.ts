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
  CreateDocumentoTiendaDto,
  DocumentoTiendaResponseDto,
  QueryDocumentoTiendaDto,
  UpdateDocumentoTiendaDto,
} from '../dtos';
import { DocumentoTiendaService } from '../services';

@Controller('identificacion/documentos-tienda')
export class DocumentoTiendaController {
  constructor(
    private readonly documentoTiendaService: DocumentoTiendaService,
  ) {}

  @Post()
  async create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto> {
    return this.documentoTiendaService.create(dto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true }))
    query: QueryDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto[]> {
    return this.documentoTiendaService.findAll(query);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<DocumentoTiendaResponseDto> {
    return this.documentoTiendaService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    dto: UpdateDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto> {
    return this.documentoTiendaService.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.documentoTiendaService.delete(id);
  }
}
