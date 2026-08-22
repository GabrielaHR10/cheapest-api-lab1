import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateTiendaDto, QueryTiendaDto, UpdateTiendaDto } from '../dtos';
import { TiendaRepository, UsuarioRepository } from '../repositories';
import { EstadoCaptacion } from '../repositories/entities';
import { TiendaService } from './tienda.service';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: jest.Mocked<TiendaRepository>;
  let usuarioRepository: jest.Mocked<UsuarioRepository>;

  const dto: CreateTiendaDto = {
    codigoInterno: 'TC001',
    nombreComercial: 'Tienda Central',
    responsableId: 'usuario-1',
    rut: '900123456-1',
    direccion: 'Cra 1 #2-3',
    telefono: '3001234567',
  };

  const entity = {
    id: 'tienda-1',
    ...dto,
    estadoCaptacion: EstadoCaptacion.PROSPECTO_CREADO,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCodigoInterno: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    const mockUsuarioRepository = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiendaService,
        {
          provide: TiendaRepository,
          useValue: mockRepository,
        },
        {
          provide: UsuarioRepository,
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get(TiendaRepository);
    usuarioRepository = module.get(UsuarioRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create tienda when codigoInterno is free and responsable exists', async () => {
      repository.findByCodigoInterno.mockResolvedValue(null);
      usuarioRepository.findById.mockResolvedValue({ id: 'usuario-1' } as any);
      repository.create.mockResolvedValue(entity as any);

      const result = await service.create(dto);

      expect(usuarioRepository.findById).toHaveBeenCalledWith('usuario-1');
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result.id).toBe('tienda-1');
      expect(result.direccion).toBe('Cra 1 #2-3');
    });

    it('should throw BadRequestException when codigoInterno already exists', async () => {
      repository.findByCodigoInterno.mockResolvedValue(entity as any);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when responsable does not exist', async () => {
      repository.findByCodigoInterno.mockResolvedValue(null);
      usuarioRepository.findById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return mapped tiendas', async () => {
      const query: QueryTiendaDto = { codigoInterno: 'TC001' };
      repository.findAll.mockResolvedValue([entity] as any);

      const result = await service.findAll(query);

      expect(repository.findAll).toHaveBeenCalledWith(query);
      expect(result).toHaveLength(1);
      expect(result[0].responsableId).toBe('usuario-1');
    });
  });

  describe('findById', () => {
    it('should throw NotFoundException when tienda does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should validate the new responsable when provided', async () => {
      const updates: UpdateTiendaDto = { responsableId: 'usuario-2' };
      repository.findById.mockResolvedValue(entity as any);
      usuarioRepository.findById.mockResolvedValue(null);

      await expect(service.update('tienda-1', updates)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should update tienda when it exists', async () => {
      const updates: UpdateTiendaDto = { nombreComercial: 'Tienda Norte' };
      repository.findById.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue({
        ...entity,
        nombreComercial: 'Tienda Norte',
      } as any);

      const result = await service.update('tienda-1', updates);

      expect(repository.update).toHaveBeenCalledWith('tienda-1', updates);
      expect(result.nombreComercial).toBe('Tienda Norte');
    });
  });

  describe('delete', () => {
    it('should throw NotFoundException when tienda does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.delete('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });

  describe('exists', () => {
    it('should return true when tienda exists', async () => {
      repository.findById.mockResolvedValue(entity as any);

      await expect(service.exists('tienda-1')).resolves.toBe(true);
    });

    it('should return false when tienda does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.exists('non-existent')).resolves.toBe(false);
    });
  });
});
