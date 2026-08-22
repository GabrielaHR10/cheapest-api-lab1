import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryDocumentoTiendaDto {
  @IsOptional()
  @IsUUID()
  tiendaId?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
