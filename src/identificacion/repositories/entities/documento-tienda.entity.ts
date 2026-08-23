import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tienda } from './tienda.entity';

@Entity('documentos_tienda')
export class DocumentoTienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tiendaId: string;

  @Column('varchar', { length: 100 })
  tipo: string;

  @Column('varchar', { length: 100 })
  numero: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('timestamp')
  fechaRecepcion: Date;

  @Column('boolean', { default: false })
  validado: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // onDelete CASCADE: un documento no existe sin su tienda (composicion).
  // Es la base de datos la que borra los hijos, de forma atomica.
  @ManyToOne(() => Tienda, (tienda) => tienda.documentos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tiendaId' })
  tienda: Tienda;
}
