import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryUsuarioDto } from '../dtos';
import { Usuario, Perfil } from './entities';
import { UsuarioRepository } from './usuario.repository';

describe('UsuarioRepository', () => {
  let repository: UsuarioRepository;
  let typeormRepo: jest.Mocked<Repository<Usuario>>;

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
        UsuarioRepository,
        {
          provide: 'USUARIO_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<UsuarioRepository>(UsuarioRepository);
    typeormRepo = module.get('USUARIO_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save usuario', async () => {
      const data = {
        nombre: 'Ana Torres',
        telefono: '3001234567',
        perfil: Perfil.TENDERO,
      };
      const created = { id: 'usuario-1', ...data };
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
    it('should build query and return usuarios', async () => {
      const query: QueryUsuarioDto = { perfil: Perfil.TENDERO };
      const rows: Usuario[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(rows),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('usuario');
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual(rows);
    });
  });

  describe('findById', () => {
    it('should return usuario when found', async () => {
      const row = {
        id: 'usuario-1',
        nombre: 'Ana Torres',
        telefono: '3001234567',
        perfil: Perfil.TENDERO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.findOne.mockResolvedValue(row as any);

      const result = await repository.findById('usuario-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'usuario-1' },
      });
      expect(result).toEqual(row);
    });

    it('should return null when usuario not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated usuario', async () => {
      const updates = { nombre: 'Ana Maria Torres' };
      const updated = {
        id: 'usuario-1',
        nombre: 'Ana Maria Torres',
        telefono: '3001234567',
        perfil: Perfil.TENDERO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('usuario-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('usuario-1', updates);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete usuario and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('usuario-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('usuario-1');
      expect(result).toBe(true);
    });

    it('should return false when usuario not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
