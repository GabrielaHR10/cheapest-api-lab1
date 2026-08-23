import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaisDto, QueryPaisDto } from '../dtos';
import { PaisRepository, TiendaRepository } from '../repositories';
import { Moneda } from '../repositories/entities';
import { PaisService } from './pais.service';

describe('PaisService', () => {
  let service: PaisService;
  let repository: jest.Mocked<PaisRepository>;
  let tiendaRepository: jest.Mocked<TiendaRepository>;

  const dto: CreatePaisDto = {
    nombre: 'Colombia',
    moneda: Moneda.COP,
  };

  const entity = {
    id: 'pais-1',
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByNombre: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const mockTiendaRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaisService,
        {
          provide: PaisRepository,
          useValue: mockRepository,
        },
        {
          provide: TiendaRepository,
          useValue: mockTiendaRepository,
        },
      ],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get(PaisRepository);
    tiendaRepository = module.get(TiendaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create pais when nombre is free', async () => {
      repository.findByNombre.mockResolvedValue(null);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.moneda).toBe(Moneda.COP);
    });

    it('should throw BadRequestException when nombre already exists', async () => {
      repository.findByNombre.mockResolvedValue(entity as any);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return mapped paises', async () => {
      const query: QueryPaisDto = { nombre: 'Colombia' };
      repository.findAll.mockResolvedValue([entity] as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when pais does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update pais when it exists', async () => {
      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue({
        ...entity,
        moneda: Moneda.MXN,
      } as any);

      const result = await service.update('pais-1', { moneda: Moneda.MXN });

      expect(result.moneda).toBe(Moneda.MXN);
    });
  });

  describe('delete', () => {
    it('should delete pais when it has no tiendas', async () => {
      repository.findById.mockResolvedValue(entity as any);
      tiendaRepository.findAll.mockResolvedValue([]);
      repository.delete.mockResolvedValue(true);

      await service.delete('pais-1');

      expect(tiendaRepository.findAll).toHaveBeenCalledWith({
        paisId: 'pais-1',
      });
      expect(repository.delete).toHaveBeenCalledWith('pais-1');
    });

    it('should throw BadRequestException when pais has tiendas', async () => {
      repository.findById.mockResolvedValue(entity as any);
      tiendaRepository.findAll.mockResolvedValue([{ id: 'tienda-1' }] as any);

      await expect(service.delete('pais-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when pais does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
