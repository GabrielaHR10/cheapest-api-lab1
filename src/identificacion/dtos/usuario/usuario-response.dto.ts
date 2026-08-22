import { Perfil } from '../../repositories/entities';

export class UsuarioResponseDto {
  id: string;
  nombre: string;
  telefono: string;
  perfil: Perfil;
  createdAt: Date;
  updatedAt: Date;
}
