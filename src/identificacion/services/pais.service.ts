import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreatePaisDto,
  PaisResponseDto,
  QueryPaisDto,
  UpdatePaisDto,
} from '../dtos';
import { PaisRepository, TiendaRepository } from '../repositories';
import { Pais } from '../repositories/entities';

@Injectable()
export class PaisService {
  constructor(
    private readonly paisRepository: PaisRepository,
    private readonly tiendaRepository: TiendaRepository,
  ) {}

  async create(dto: CreatePaisDto): Promise<PaisResponseDto> {
    const existente = await this.paisRepository.findByNombre(dto.nombre);
    if (existente) {
      throw new BadRequestException(
        `Ya existe un pais con nombre ${dto.nombre}`,
      );
    }

    const pais = await this.paisRepository.create(dto);
    return this.mapToResponse(pais);
  }

  async findAll(query: QueryPaisDto): Promise<PaisResponseDto[]> {
    const paises = await this.paisRepository.findAll(query);
    return paises.map((pais) => this.mapToResponse(pais));
  }

  async findById(id: string): Promise<PaisResponseDto> {
    const pais = await this.paisRepository.findById(id);
    if (!pais) {
      throw new NotFoundException(`Pais con id ${id} no encontrado`);
    }
    return this.mapToResponse(pais);
  }

  async update(id: string, dto: UpdatePaisDto): Promise<PaisResponseDto> {
    const pais = await this.paisRepository.findById(id);
    if (!pais) {
      throw new NotFoundException(`Pais con id ${id} no encontrado`);
    }

    const updated = await this.paisRepository.update(id, dto);
    return this.mapToResponse(updated!);
  }

  async delete(id: string): Promise<void> {
    const pais = await this.paisRepository.findById(id);
    if (!pais) {
      throw new NotFoundException(`Pais con id ${id} no encontrado`);
    }

    // Mismo criterio que con Usuario: no se usa cascada, porque borrar un pais
    // no puede arrastrar las tiendas que operan en el.
    const tiendas = await this.tiendaRepository.findAll({ paisId: id });
    if (tiendas.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el pais: tiene ${tiendas.length} tienda(s) asociada(s)`,
      );
    }

    await this.paisRepository.delete(id);
  }

  private mapToResponse(pais: Pais): PaisResponseDto {
    return {
      id: pais.id,
      nombre: pais.nombre,
      moneda: pais.moneda,
      createdAt: pais.createdAt,
      updatedAt: pais.updatedAt,
    };
  }
}
