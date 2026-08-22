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

  @ManyToOne(() => Tienda, (tienda) => tienda.documentos)
  @JoinColumn({ name: 'tiendaId' })
  tienda: Tienda;
}
