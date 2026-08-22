import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateDocumentoTiendaDto, QueryDocumentoTiendaDto } from '../dtos';
import { DocumentoTiendaRepository, TiendaRepository } from '../repositories';
import { DocumentoTiendaService } from './documento-tienda.service';

describe('DocumentoTiendaService', () => {
  let service: DocumentoTiendaService;
  let repository: jest.Mocked<DocumentoTiendaRepository>;
  let tiendaRepository: jest.Mocked<TiendaRepository>;

  const dto: CreateDocumentoTiendaDto = {
    tiendaId: 'tienda-1',
    tipo: 'RUT',
    numero: '900123456-1',
    direccion: 'Cra 1 #2-3',
    fechaRecepcion: new Date(),
  };

  const entity = {
    id: 'documento-1',
    ...dto,
    validado: false,
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
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentoTiendaService,
        {
          provide: DocumentoTiendaRepository,
          useValue: mockRepository,
        },
        {
          provide: TiendaRepository,
          useValue: mockTiendaRepository,
        },
      ],
    }).compile();

    service = module.get<DocumentoTiendaService>(DocumentoTiendaService);
    repository = module.get(DocumentoTiendaRepository);
    tiendaRepository = module.get(TiendaRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create documento when tienda exists', async () => {
      tiendaRepository.findById.mockResolvedValue({ id: 'tienda-1' } as any);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(tiendaRepository.findById).toHaveBeenCalledWith('tienda-1');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.validado).toBe(false);
    });

    it('should throw BadRequestException when tienda does not exist', async () => {
      tiendaRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return mapped documentos', async () => {
      const query: QueryDocumentoTiendaDto = { tiendaId: 'tienda-1' };
      repository.findAll.mockResolvedValue([entity] as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].tiendaId).toBe('tienda-1');
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when documento does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should mark documento as validado', async () => {
      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue({ ...entity, validado: true } as any);

      const result = await service.update('documento-1', { validado: true });

      expect(repository.update).toHaveBeenCalledWith('documento-1', {
        validado: true,
      });
      expect(result.validado).toBe(true);
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when documento does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
