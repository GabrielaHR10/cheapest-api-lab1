import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryPaisDto } from '../dtos';
import { Pais } from './entities';

@Injectable()
export class PaisRepository {
  constructor(
    @Inject('PAIS_REPOSITORY')
    private repository: Repository<Pais>,
  ) {}

  async create(pais: Partial<Pais>): Promise<Pais> {
    const newPais = this.repository.create(pais);
    return this.repository.save(newPais);
  }

  async findAll(query: QueryPaisDto): Promise<Pais[]> {
    const queryBuilder = this.repository.createQueryBuilder('pais');

    if (query.nombre) {
      queryBuilder.andWhere('pais.nombre ILIKE :nombre', {
        nombre: `%${query.nombre}%`,
      });
    }

    if (query.moneda) {
      queryBuilder.andWhere('pais.moneda = :moneda', { moneda: query.moneda });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Pais | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByNombre(nombre: string): Promise<Pais | null> {
    return this.repository.findOne({ where: { nombre } });
  }

  async update(id: string, updates: Partial<Pais>): Promise<Pais | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
