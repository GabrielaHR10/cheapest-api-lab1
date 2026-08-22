import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryUsuarioDto } from '../dtos';
import { Usuario } from './entities';

@Injectable()
export class UsuarioRepository {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private repository: Repository<Usuario>,
  ) {}

  async create(usuario: Partial<Usuario>): Promise<Usuario> {
    const newUsuario = this.repository.create(usuario);
    return this.repository.save(newUsuario);
  }

  async findAll(query: QueryUsuarioDto): Promise<Usuario[]> {
    const queryBuilder = this.repository.createQueryBuilder('usuario');

    if (query.nombre) {
      queryBuilder.andWhere('usuario.nombre ILIKE :nombre', {
        nombre: `%${query.nombre}%`,
      });
    }

    if (query.perfil) {
      queryBuilder.andWhere('usuario.perfil = :perfil', {
        perfil: query.perfil,
      });
    }

    return queryBuilder.getMany();
  }

  async findById(id: string): Promise<Usuario | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, updates: Partial<Usuario>): Promise<Usuario | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
