import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryPaisDto } from '../dtos';
import { Pais, Moneda } from './entities';
import { PaisRepository } from './pais.repository';

describe('PaisRepository', () => {
  let repository: PaisRepository;
  let typeormRepo: jest.Mocked<Repository<Pais>>;

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
        PaisRepository,
        {
          provide: 'PAIS_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<PaisRepository>(PaisRepository);
    typeormRepo = module.get('PAIS_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save pais', async () => {
      const data = {
        nombre: 'Colombia',
        moneda: Moneda.COP,
      };
      const created = { id: 'pais-1', ...data };
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
    it('should build query and return paiss', async () => {
      const query: QueryPaisDto = { nombre: 'Colombia' };
      const rows: Pais[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(rows),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('pais');
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual(rows);
    });
  });

  describe('findById', () => {
    it('should return pais when found', async () => {
      const row = {
        id: 'pais-1',
        nombre: 'Colombia',
        moneda: Moneda.COP,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(row as any);

      const result = await repository.findById('pais-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'pais-1' },
      });
      expect(result).toEqual(row);
    });

    it('should return null when pais not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated pais', async () => {
      const updates = { moneda: Moneda.MXN };
      const updated = {
        id: 'pais-1',
        nombre: 'Colombia',
        moneda: Moneda.MXN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('pais-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('pais-1', updates);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete pais and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('pais-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('pais-1');
      expect(result).toBe(true);
    });

    it('should return false when pais not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
