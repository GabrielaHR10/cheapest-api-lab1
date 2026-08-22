import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUsuarioDto,
  QueryUsuarioDto,
  UpdateUsuarioDto,
  UsuarioResponseDto,
} from '../dtos';
import { Perfil } from '../repositories/entities';
import { UsuarioService } from '../services';
import { UsuarioController } from './usuario.controller';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: jest.Mocked<UsuarioService>;

  const response: UsuarioResponseDto = {
    id: 'usuario-1',
    nombre: 'Ana Torres',
    telefono: '3001234567',
    perfil: Perfil.TENDERO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: UsuarioService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get(UsuarioService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateUsuarioDto = {
        nombre: 'Ana Torres',
        telefono: '3001234567',
        perfil: Perfil.TENDERO,
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryUsuarioDto = { perfil: Perfil.TENDERO };

      service.findAll.mockResolvedValue([response]);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([response]);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('usuario-1');

      expect(service.findById).toHaveBeenCalledWith('usuario-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateUsuarioDto = { nombre: 'Ana Maria Torres' };
      const updated: UsuarioResponseDto = { ...response, ...dto };

      service.update.mockResolvedValue(updated);

      const result = await controller.update('usuario-1', dto);

      expect(service.update).toHaveBeenCalledWith('usuario-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('usuario-1');

      expect(service.delete).toHaveBeenCalledWith('usuario-1');
    });
  });
});
