import { Module } from '@nestjs/common';

// Database
import { DatabaseModule } from '../datasources/database.module';

// Repositories
import { TiendaRepository } from './repositories';
import { repositoryProviders } from './repositories/repository.providers';

// Services
import { TiendaService } from './services';

// Controllers
import { TiendaController } from './controllers';

@Module({
  imports: [DatabaseModule],
  controllers: [TiendaController],
  providers: [
    // Repository Providers
    ...repositoryProviders,
    // Repositories
    TiendaRepository,
    // Services
    TiendaService,

    //Están en el arreglo providers porque providers es el lugar donde registras 
    //todas las clases que NestJS debe instanciar, administrar e inyectar mediante su sistema de Inyección de Dependencias (
  ],
  exports: [TiendaService],
})

export class IdentificacionModule {}
