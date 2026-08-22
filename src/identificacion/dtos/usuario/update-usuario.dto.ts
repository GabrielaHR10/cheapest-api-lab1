import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Perfil } from '../../repositories/entities';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsOptional()
  @IsEnum(Perfil)
  perfil?: Perfil;
}
