import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Moneda {
  COP = 'COP',
  MXN = 'MXN',
  BRL = 'BRL',
}

@Entity('paises')
export class Pais {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: Moneda,
  })
  moneda: Moneda;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
