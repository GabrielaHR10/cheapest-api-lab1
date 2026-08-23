import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentoTienda } from './documento-tienda.entity';
import { Pais } from './pais.entity';
import { Usuario } from './usuario.entity';

export enum EstadoCaptacion {
  PROSPECTO_CREADO = 'prospectoCreado',
  VISITA_1_REALIZADA = 'visita1Realizada',
  DOCUMENTOS_RECIBIDOS = 'documentosRecibidos',
  VISITA_2_REALIZADA = 'visita2Realizada',
  RUT_VALIDADO = 'rutValidado',
  HABILITADO_BASICO = 'habilitadoBasico',
  HABILITADO_AVANZADO = 'habilitadoAvanzado',
}

@Entity('tiendas')
export class Tienda {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  codigoInterno: string;

  @Column('varchar', { length: 255 })
  nombreComercial: string;

  @Column('uuid')
  responsableId: string;

  @Column('uuid')
  paisId: string;

  @Column('varchar', { length: 100 })
  rut: string;

  @Column('varchar', { length: 255 })
  direccion: string;

  @Column('varchar', { length: 50 })
  telefono: string;

  @Column({
    type: 'enum',
    enum: EstadoCaptacion,
    default: EstadoCaptacion.PROSPECTO_CREADO,
  })
  estadoCaptacion: EstadoCaptacion;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.tiendas)
  @JoinColumn({ name: 'responsableId' })
  responsable: Usuario;

  @ManyToOne(() => Pais, (pais) => pais.tiendas)
  @JoinColumn({ name: 'paisId' })
  pais: Pais;

  @OneToMany(() => DocumentoTienda, (documento) => documento.tienda)
  documentos: DocumentoTienda[];
}
