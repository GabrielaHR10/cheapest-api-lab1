import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateDocumentoTiendaDto,
  QueryDocumentoTiendaDto,
  UpdateDocumentoTiendaDto,
  DocumentoTiendaResponseDto,
} from '../dtos';
import { DocumentoTiendaService } from '../services';
import { DocumentoTiendaController } from './documento-tienda.controller';

describe('DocumentoTiendaController', () => {
  let controller: DocumentoTiendaController;
  let service: jest.Mocked<DocumentoTiendaService>;

  const response: DocumentoTiendaResponseDto = {
    id: 'documento-1',
    tiendaId: 'tienda-1',
    tipo: 'RUT',
    numero: '900123456-1',
    direccion: 'Cra 1 #2-3',
    fechaRecepcion: new Date(),
    validado: false,
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
      controllers: [DocumentoTiendaController],
      providers: [
        {
          provide: DocumentoTiendaService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<DocumentoTiendaController>(
      DocumentoTiendaController,
    );
    service = module.get(DocumentoTiendaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto: CreateDocumentoTiendaDto = {
        tiendaId: 'tienda-1',
        tipo: 'RUT',
        numero: '900123456-1',
        direccion: 'Cra 1 #2-3',
        fechaRecepcion: new Date(),
        validado: false,
      };

      service.create.mockResolvedValue(response);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(response);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query', async () => {
      const query: QueryDocumentoTiendaDto = { tiendaId: 'tienda-1' };

      service.findAll.mockResolvedValue([response]);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual([response]);
    });
  });

  describe('findById', () => {
    it('should call service.findById with id', async () => {
      service.findById.mockResolvedValue(response);

      const result = await controller.findById('documento-1');

      expect(service.findById).toHaveBeenCalledWith('documento-1');
      expect(result).toEqual(response);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateDocumentoTiendaDto = { validado: true };
      const updated: DocumentoTiendaResponseDto = { ...response, ...dto };

      service.update.mockResolvedValue(updated);

      const result = await controller.update('documento-1', dto);

      expect(service.update).toHaveBeenCalledWith('documento-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should call service.delete with id', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('documento-1');

      expect(service.delete).toHaveBeenCalledWith('documento-1');
    });
  });
});
