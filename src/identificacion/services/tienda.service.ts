import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTiendaDto,
  QueryTiendaDto,
  TiendaResponseDto,
  UpdateTiendaDto,
} from '../dtos';
import {
  PaisRepository,
  TiendaRepository,
  UsuarioRepository,
} from '../repositories';
import { Tienda } from '../repositories/entities';

@Injectable()
export class TiendaService {
  constructor(
    private readonly tiendaRepository: TiendaRepository,
    private readonly usuarioRepository: UsuarioRepository,
    private readonly paisRepository: PaisRepository,
  ) {}

  async create(dto: CreateTiendaDto): Promise<TiendaResponseDto> {
    const existente = await this.tiendaRepository.findByCodigoInterno(
      dto.codigoInterno,
    );
    if (existente) {
      throw new BadRequestException(
        `Ya existe una tienda con codigoInterno ${dto.codigoInterno}`,
      );
    }

    // Validar que el usuario responsable existe
    const responsable = await this.usuarioRepository.findById(
      dto.responsableId,
    );
    if (!responsable) {
      throw new BadRequestException(
        `Usuario con id ${dto.responsableId} no existe`,
      );
    }

    // Validar que el pais exista
    const pais = await this.paisRepository.findById(dto.paisId);
    if (!pais) {
      throw new BadRequestException(`Pais con id ${dto.paisId} no existe`);
    }

    const tienda = await this.tiendaRepository.create(dto);
    return this.mapToResponse(tienda);
  }

  async findAll(query: QueryTiendaDto): Promise<TiendaResponseDto[]> {
    const tiendas = await this.tiendaRepository.findAll(query);
    return tiendas.map((tienda) => this.mapToResponse(tienda));
  }

  async findById(id: string): Promise<TiendaResponseDto> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }
    return this.mapToResponse(tienda);
  }

  async update(id: string, dto: UpdateTiendaDto): Promise<TiendaResponseDto> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }

    if (dto.responsableId) {
      const responsable = await this.usuarioRepository.findById(
        dto.responsableId,
      );
      if (!responsable) {
        throw new BadRequestException(
          `Usuario con id ${dto.responsableId} no existe`,
        );
      }
    }

    if (dto.paisId) {
      const pais = await this.paisRepository.findById(dto.paisId);
      if (!pais) {
        throw new BadRequestException(`Pais con id ${dto.paisId} no existe`);
      }
    }

    const updated = await this.tiendaRepository.update(id, dto);
    return this.mapToResponse(updated!);
  }

  async delete(id: string): Promise<void> {
    const tienda = await this.tiendaRepository.findById(id);
    if (!tienda) {
      throw new NotFoundException(`Tienda con id ${id} no encontrada`);
    }

    await this.tiendaRepository.delete(id);
  }

  /**
   * Consumido por otros modulos (Logistica) para verificar la existencia
   * de una tienda sin exponer el repositorio ni la entidad.
   */
  async exists(id: string): Promise<boolean> {
    const tienda = await this.tiendaRepository.findById(id);
    return tienda !== null;
  }

  private mapToResponse(tienda: Tienda): TiendaResponseDto {
    return {
      id: tienda.id,
      codigoInterno: tienda.codigoInterno,
      nombreComercial: tienda.nombreComercial,
      responsableId: tienda.responsableId,
      paisId: tienda.paisId,
      rut: tienda.rut,
      direccion: tienda.direccion,
      telefono: tienda.telefono,
      estadoCaptacion: tienda.estadoCaptacion,
      createdAt: tienda.createdAt,
      updatedAt: tienda.updatedAt,
    };
  }
}
