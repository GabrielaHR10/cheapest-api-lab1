import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Moneda } from '../../repositories/entities';

export class UpdatePaisDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsEnum(Moneda)
  moneda?: Moneda;
}
