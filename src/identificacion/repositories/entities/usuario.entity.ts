import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tienda } from './tienda.entity';

export enum Perfil {
  TENDERO = 'tendero',
  CAJERO = 'cajero',
  VENDEDOR = 'vendedor',
  OPERADOR = 'operador',
  SUPERVISOR = 'supervisor',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  nombre: string;

  @Column('varchar', { length: 50 })
  telefono: string;

  @Column({
    type: 'enum',
    enum: Perfil,
  })
  perfil: Perfil;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Tienda, (tienda) => tienda.responsable)
  tiendas: Tienda[];
}
