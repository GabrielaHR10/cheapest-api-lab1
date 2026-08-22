import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../datasources/database.module';

// Repositories
import {
  DocumentoTiendaRepository,
  PaisRepository,
  TiendaRepository,
  UsuarioRepository,
} from './repositories';
import { repositoryProviders } from './repositories/repository.providers';

// Services
import {
  DocumentoTiendaService,
  PaisService,
  TiendaService,
  UsuarioService,
} from './services';

// Controllers
import {
  DocumentoTiendaController,
  PaisController,
  TiendaController,
  UsuarioController,
} from './controllers';

@Module({
  imports: [DatabaseModule],
  controllers: [
    TiendaController,
    UsuarioController,
    PaisController,
    DocumentoTiendaController,
  ],
  providers: [
    // Repository Providers
    ...repositoryProviders,
    // Repositories
    TiendaRepository,
    UsuarioRepository,
    PaisRepository,
    DocumentoTiendaRepository,
    // Services
    TiendaService,
    UsuarioService,
    PaisService,
    DocumentoTiendaService,
    // Van en providers porque es donde se registran las clases que Nest debe
    // instanciar, administrar e inyectar a traves de su contenedor de DI.
  ],
  exports: [TiendaService, UsuarioService, PaisService, DocumentoTiendaService],
})
export class IdentificacionModule {}
