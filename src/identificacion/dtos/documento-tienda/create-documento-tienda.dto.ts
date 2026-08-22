import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateDocumentoTiendaDto {
  @IsUUID()
  tiendaId: string;

  @IsString()
  @MaxLength(100)
  tipo: string;

  @IsString()
  @MaxLength(100)
  numero: string;

  @IsString()
  @MaxLength(255)
  direccion: string;

  @IsDateString()
  fechaRecepcion: Date;

  @IsOptional()
  @IsBoolean()
  validado?: boolean;
}
