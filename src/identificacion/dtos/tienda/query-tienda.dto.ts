import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { EstadoCaptacion } from '../../repositories/entities';

export class QueryTiendaDto {
  @IsOptional()
  @IsString()
  codigoInterno?: string;

  @IsOptional()
  @IsString()
  nombreComercial?: string;

  @IsOptional()
  @IsUUID()
  responsableId?: string;

  @IsOptional()
  @IsUUID()
  paisId?: string;

  @IsOptional()
  @IsEnum(EstadoCaptacion)
  estadoCaptacion?: EstadoCaptacion;
}
