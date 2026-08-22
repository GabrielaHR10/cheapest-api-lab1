import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateDocumentoTiendaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tipo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  numero?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  direccion?: string;

  @IsOptional()
  @IsDateString()
  fechaRecepcion?: Date;

  @IsOptional()
  @IsBoolean()
  validado?: boolean;
}
