import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryDocumentoTiendaDto } from '../dtos';
import { DocumentoTienda } from './entities';

@Injectable()
export class DocumentoTiendaRepository {
  constructor(
    @Inject('DOCUMENTO_TIENDA_REPOSITORY')
    private repository: Repository<DocumentoTienda>,
  ) {}

  async create(documento: Partial<DocumentoTienda>): Promise<DocumentoTienda> {
    const newDocumento = this.repository.create(documento);
    return this.repository.save(newDocumento);
  }

  async findAll(query: QueryDocumentoTiendaDto): Promise<DocumentoTienda[]> {
    const queryBuilder = this.repository.createQueryBuilder('documento');

    if (query.tiendaId) {
      queryBuilder.andWhere('documento.tiendaId = :tiendaId', {
        tiendaId: query.tiendaId,
      });
    }

    if (query.tipo) {
      queryBuilder.andWhere('documento.tipo = :tipo', { tipo: query.tipo });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<DocumentoTienda | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<DocumentoTienda>,
  ): Promise<DocumentoTienda | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
