import { Moneda } from '../../repositories/entities';

export class PaisResponseDto {
  id: string;
  nombre: string;
  moneda: Moneda;
  createdAt: Date;
  updatedAt: Date;
}
