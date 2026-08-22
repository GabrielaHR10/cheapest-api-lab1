import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Perfil } from '../../repositories/entities';

export class QueryUsuarioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(Perfil)
  perfil?: Perfil;
}
