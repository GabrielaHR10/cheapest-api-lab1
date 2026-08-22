import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Moneda } from '../../repositories/entities';

export class QueryPaisDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsEnum(Moneda)
  moneda?: Moneda;
}
