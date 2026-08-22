import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Perfil } from '../../repositories/entities';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(255)
  nombre: string;

  @IsString()
  @MaxLength(50)
  telefono: string;

  @IsEnum(Perfil)
  perfil: Perfil;
}
