import { EstadoCaptacion } from '../../repositories/entities';

export class TiendaResponseDto {
  id: string;
  codigoInterno: string;
  nombreComercial: string;
  rut: string;
  direccion: string;
  telefono: string;
  estadoCaptacion: EstadoCaptacion;
  responsableId: string | null;
  paisId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
