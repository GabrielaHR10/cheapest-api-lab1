import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateUsuarioDto,
  QueryUsuarioDto,
  UpdateUsuarioDto,
  UsuarioResponseDto,
} from '../dtos';
import { UsuarioRepository } from '../repositories';
import { Usuario } from '../repositories/entities';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async create(dto: CreateUsuarioDto): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.create(dto);
    return this.mapToResponse(usuario);
  }

  async findAll(query: QueryUsuarioDto): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepository.findAll(query);
    return usuarios.map((usuario) => this.mapToResponse(usuario));
  }

  async findById(id: string): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return this.mapToResponse(usuario);
  }

  async update(id: string, dto: UpdateUsuarioDto): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    const updated = await this.usuarioRepository.update(id, dto);
    return this.mapToResponse(updated!);
  }

  async delete(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    await this.usuarioRepository.delete(id);
  }

  private mapToResponse(usuario: Usuario): UsuarioResponseDto {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      telefono: usuario.telefono,
      perfil: usuario.perfil,
      createdAt: usuario.createdAt,
      updatedAt: usuario.updatedAt,
    };
  }
}
