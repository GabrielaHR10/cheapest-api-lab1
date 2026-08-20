import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { QueryTiendaDto } from '../dtos';
import { Tienda } from './entities';

//Es ideal mantener la lógica de filtrado dentro del repo (query builder). Esto reduce el acoplamiento dado que diferentes ORMs y diferentes bases de datos manejan de forma diferente la forma en la que se hacen consultas complejas

@Injectable()
export class TiendaRepository {
  constructor(
    @Inject('TIENDA_REPOSITORY')
    private repository: Repository<Tienda>,
  ) {}
  //En TypeScript, se pone Promise<...> en el tipo de retorno de una función para indicar que es asíncrona y que devolverá un valor
  // en el futuro, cuando termine la operación.

  //Por qué usa Partial<Tienda>: Cuando vas a registrar una tienda nueva, solo envías los datos básicos (como el nombre o la dirección).
  // Aún no tienes campos como el id, la fecha de creación (createdAt), o los valores por defecto que asigna la base de datos. Si no usaras
  // Partial, TypeScript te marcaría un error exigiéndote enviar un id que todavía no existe.
  async create(tienda: Partial<Tienda>): Promise<Tienda> {
    const newTienda = this.repository.create(tienda);
    return this.repository.save(newTienda);
  }

  async findAll(query: QueryTiendaDto): Promise<Tienda[]> {
    const queryBuilder = this.repository.createQueryBuilder('tienda');
    //es un método de TypeORM que te permite construir consultas SQL
    //personalizadas y complejas utilizando código de TypeScript
    if (query.codigoInterno) {
      queryBuilder.andWhere('tienda.codigoInterno = :codigoInterno', {
        codigoInterno: query.codigoInterno,
      });
    }

    if (query.nombreComercial) {
      queryBuilder.andWhere('tienda.nombreComercial ILIKE :nombreComercial', {
        nombreComercial: `%${query.nombreComercial}%`,
      });
    }

    if (query.estadoCaptacion) {
      queryBuilder.andWhere('tienda.estadoCaptacion = :estadoCaptacion', {
        estadoCaptacion: query.estadoCaptacion,
      });
    }

    return queryBuilder.getMany();
    //getMany() devuelve una lista de tiendas que cumplan la combinación de todos
    // los if en los que entró el programa. Para eso era el andwhere.
  }

  //En JavaScript, cuando el nombre de la propiedad y el nombre de la variable son iguales, se puede omitir el valor.
  //  Esa línea es exactamente lo mismo que haber escrito esto de forma extendida: { where: { id: id } }

  async findById(id: string): Promise<Tienda | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByCodigoInterno(codigoInterno: string): Promise<Tienda | null> {
    return this.repository.findOne({ where: { codigoInterno } });
  }

  async update(id: string, updates: Partial<Tienda>): Promise<Tienda | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
