import { DataSource } from 'typeorm';
import { DocumentoTienda, Pais, Tienda, Usuario } from './entities';

export const repositoryProviders = [
  {
    provide: 'TIENDA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tienda),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'USUARIO_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Usuario),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAIS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Pais),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'DOCUMENTO_TIENDA_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(DocumentoTienda),
    inject: ['DATA_SOURCE'],
  },
];
