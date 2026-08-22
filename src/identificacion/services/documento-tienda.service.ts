import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateDocumentoTiendaDto,
  DocumentoTiendaResponseDto,
  QueryDocumentoTiendaDto,
  UpdateDocumentoTiendaDto,
} from '../dtos';
import { DocumentoTiendaRepository, TiendaRepository } from '../repositories';
import { DocumentoTienda } from '../repositories/entities';

@Injectable()
export class DocumentoTiendaService {
  constructor(
    private readonly documentoTiendaRepository: DocumentoTiendaRepository,
    private readonly tiendaRepository: TiendaRepository,
  ) {}

  async create(
    dto: CreateDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto> {
    // Validar que la tienda existe
    const tienda = await this.tiendaRepository.findById(dto.tiendaId);
    if (!tienda) {
      throw new BadRequestException(`Tienda con id ${dto.tiendaId} no existe`);
    }

    const documento = await this.documentoTiendaRepository.create(dto);
    return this.mapToResponse(documento);
  }

  async findAll(
    query: QueryDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto[]> {
    const documentos = await this.documentoTiendaRepository.findAll(query);
    return documentos.map((documento) => this.mapToResponse(documento));
  }

  async findById(id: string): Promise<DocumentoTiendaResponseDto> {
    const documento = await this.documentoTiendaRepository.findById(id);
    if (!documento) {
      throw new NotFoundException(`Documento con id ${id} no encontrado`);
    }
    return this.mapToResponse(documento);
  }

  async update(
    id: string,
    dto: UpdateDocumentoTiendaDto,
  ): Promise<DocumentoTiendaResponseDto> {
    const documento = await this.documentoTiendaRepository.findById(id);
    if (!documento) {
      throw new NotFoundException(`Documento con id ${id} no encontrado`);
    }

    const updated = await this.documentoTiendaRepository.update(id, dto);
    return this.mapToResponse(updated!);
  }

  async delete(id: string): Promise<void> {
    const documento = await this.documentoTiendaRepository.findById(id);
    if (!documento) {
      throw new NotFoundException(`Documento con id ${id} no encontrado`);
    }

    await this.documentoTiendaRepository.delete(id);
  }

  private mapToResponse(
    documento: DocumentoTienda,
  ): DocumentoTiendaResponseDto {
    return {
      id: documento.id,
      tiendaId: documento.tiendaId,
      tipo: documento.tipo,
      numero: documento.numero,
      direccion: documento.direccion,
      fechaRecepcion: documento.fechaRecepcion,
      validado: documento.validado,
      createdAt: documento.createdAt,
      updatedAt: documento.updatedAt,
    };
  }
}
