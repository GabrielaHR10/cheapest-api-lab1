import { Test, TestingModule } from '@nestjs/testing';
import {
  CreatePaisDto,
  QueryPaisDto,
  UpdatePaisDto,
  PaisResponseDto,
} from '../dtos';
import { Moneda } from '../repositories/entities';
import { PaisService } from '../services';
import { PaisController } from './pais.controller';

describe('PaisController', () => {
  let controller: PaisController;
  let service: jest.Mocked<PaisService>;

  const response: PaisResponseDto = {
    id: 'pais-1',
    nombre: 'Colombia',
    moneda: Moneda.COP,
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
      controllers: [PaisController],
      providers: [
        {
          provide: PaisService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PaisController>(PaisController);
    service = module.get(PaisService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreatePaisDto = {
        nombre: 'Colombia',
        moneda: Moneda.COP,
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryPaisDto = { nombre: 'Colombia' };

      service.findAll.mockResolvedValue([response]);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([response]);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('pais-1');

      expect(service.findById).toHaveBeenCalledWith('pais-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdatePaisDto = { moneda: Moneda.MXN };
      const updated: PaisResponseDto = { ...response, ...dto };

      service.update.mockResolvedValue(updated);

      const result = await controller.update('pais-1', dto);

      expect(service.update).toHaveBeenCalledWith('pais-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('pais-1');

      expect(service.delete).toHaveBeenCalledWith('pais-1');
    });
  });
});
