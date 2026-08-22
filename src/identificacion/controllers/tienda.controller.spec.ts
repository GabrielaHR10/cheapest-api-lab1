import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateTiendaDto,
  QueryTiendaDto,
  UpdateTiendaDto,
  TiendaResponseDto,
} from '../dtos';
import { EstadoCaptacion } from '../repositories/entities';
import { TiendaService } from '../services';
import { TiendaController } from './tienda.controller';

describe('TiendaController', () => {
  let controller: TiendaController;
  let service: jest.Mocked<TiendaService>;

  const response: TiendaResponseDto = {
    id: 'tienda-1',
    codigoInterno: 'TC001',
    nombreComercial: 'Tienda Central',
    responsableId: 'usuario-1',
    rut: '900123456-1',
    direccion: 'Cra 1 #2-3',
    telefono: '3001234567',
    estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
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
      controllers: [TiendaController],
      providers: [
        {
          provide: TiendaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TiendaController>(TiendaController);
    service = module.get(TiendaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateTiendaDto = {
        codigoInterno: 'TC001',
        nombreComercial: 'Tienda Central',
        responsableId: 'usuario-1',
        rut: '900123456-1',
        direccion: 'Cra 1 #2-3',
        telefono: '3001234567',
        estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryTiendaDto = { codigoInterno: 'TC001' };

      service.findAll.mockResolvedValue([response]);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([response]);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('tienda-1');

      expect(service.findById).toHaveBeenCalledWith('tienda-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateTiendaDto = { nombreComercial: 'Tienda Norte' };
      const updated: TiendaResponseDto = { ...response, ...dto };

      service.update.mockResolvedValue(updated);

      const result = await controller.update('tienda-1', dto);

      expect(service.update).toHaveBeenCalledWith('tienda-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('tienda-1');

      expect(service.delete).toHaveBeenCalledWith('tienda-1');
    });
  });
});
