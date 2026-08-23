import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryTiendaDto } from '../dtos';
import { Tienda, EstadoCaptacion } from './entities';
import { TiendaRepository } from './tienda.repository';

describe('TiendaRepository', () => {
  let repository: TiendaRepository;
  let typeormRepo: jest.Mocked<Repository<Tienda>>;

  beforeEach(async () => {
    const mockTypeormRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaRepository,
        {
          provide: 'TIENDA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<TiendaRepository>(TiendaRepository);
    typeormRepo = module.get('TIENDA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save tienda', async () => {
      const data = {
        codigoInterno: 'TC001',
        nombreComercial: 'Tienda Central',
        responsableId: 'usuario-1',
        paisId: 'pais-1',
        rut: '900123456-1',
        direccion: 'Cra 1 #2-3',
        telefono: '3001234567',
        estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
      };
      const created = { id: 'tienda-1', ...data };
      const saved = {
        ...created,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.create.mockReturnValue(created as any);
      typeormRepo.save.mockResolvedValue(saved as any);

      const result = await repository.create(data);

      expect(typeormRepo.create).toHaveBeenCalledWith(data);
      expect(typeormRepo.save).toHaveBeenCalledWith(created);
      expect(result).toEqual(saved);
    });
  });

  describe('findAll', () => {
    it('should build query and return tiendas', async () => {
      const query: QueryTiendaDto = { codigoInterno: 'TC001' };
      const rows: Tienda[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(rows),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('tienda');
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual(rows);
    });
  });

  describe('findById', () => {
    it('should return tienda when found', async () => {
      const row = {
        id: 'tienda-1',
        codigoInterno: 'TC001',
        nombreComercial: 'Tienda Central',
        responsableId: 'usuario-1',
        paisId: 'pais-1',
        rut: '900123456-1',
        direccion: 'Cra 1 #2-3',
        telefono: '3001234567',
        estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(row as any);

      const result = await repository.findById('tienda-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'tienda-1' },
      });
      expect(result).toEqual(row);
    });

    it('should return null when tienda not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated tienda', async () => {
      const updates = { nombreComercial: 'Tienda Norte' };
      const updated = {
        id: 'tienda-1',
        codigoInterno: 'TC001',
        nombreComercial: 'Tienda Norte',
        responsableId: 'usuario-1',
        paisId: 'pais-1',
        rut: '900123456-1',
        direccion: 'Cra 1 #2-3',
        telefono: '3001234567',
        estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('tienda-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('tienda-1', updates);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete tienda and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('tienda-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('tienda-1');
      expect(result).toBe(true);
    });

    it('should return false when tienda not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
