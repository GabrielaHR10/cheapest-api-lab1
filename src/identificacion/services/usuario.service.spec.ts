import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUsuarioDto, QueryUsuarioDto } from '../dtos';
import { TiendaRepository, UsuarioRepository } from '../repositories';
import { Perfil } from '../repositories/entities';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: jest.Mocked<UsuarioRepository>;
  let tiendaRepository: jest.Mocked<TiendaRepository>;

  const dto: CreateUsuarioDto = {
    nombre: 'Ana Torres',
    telefono: '3001234567',
    perfil: Perfil.TENDERO,
  };

  const entity = {
    id: 'usuario-1',
    ...dto,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockTiendaRepository = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: UsuarioRepository,
          useValue: mockRepository,
        },
        {
          provide: TiendaRepository,
          useValue: mockTiendaRepository,
        },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get(UsuarioRepository);
    tiendaRepository = module.get(TiendaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and map usuario', async () => {
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('usuario-1');
      expect(result.perfil).toBe(Perfil.TENDERO);
    });
  });

  describe('findAll', () => {
    it('should return mapped usuarios', async () => {
      const query: QueryUsuarioDto = { perfil: Perfil.TENDERO };
      repository.findAll.mockResolvedValue([entity] as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('should return usuario when found', async () => {
      repository.findById.mockResolvedValue(entity as any);

      const result = await service.findById('usuario-1');

      expect(result.nombre).toBe('Ana Torres');
    });

    it('should throw NotFoundException when usuario does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should throw NotFoundException when usuario does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { nombre: 'Otro' }),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete usuario when it exists and has no tiendas', async () => {
      repository.findById.mockResolvedValue(entity as any);
      tiendaRepository.findAll.mockResolvedValue([]);
      repository.delete.mockResolvedValue(true);

      await service.delete('usuario-1');

      expect(tiendaRepository.findAll).toHaveBeenCalledWith({
        responsableId: 'usuario-1',
      });
      expect(repository.delete).toHaveBeenCalledWith('usuario-1');
    });

    it('should throw BadRequestException when usuario is responsable of a tienda', async () => {
      repository.findById.mockResolvedValue(entity as any);
      tiendaRepository.findAll.mockResolvedValue([
        { id: 'tienda-1' },
        { id: 'tienda-2' },
      ] as any);

      await expect(service.delete('usuario-1')).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when usuario does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
