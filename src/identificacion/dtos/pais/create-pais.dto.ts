import { IsEnum, IsString, MaxLength } from 'class-validator';
import { Moneda } from '../../repositories/entities';

export class CreatePaisDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsEnum(Moneda)
  moneda: Moneda;
}
