import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { QueryDocumentoTiendaDto } from '../dtos';
import { DocumentoTienda } from './entities';
import { DocumentoTiendaRepository } from './documento-tienda.repository';

describe('DocumentoTiendaRepository', () => {
  let repository: DocumentoTiendaRepository;
  let typeormRepo: jest.Mocked<Repository<DocumentoTienda>>;

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
        DocumentoTiendaRepository,
        {
          provide: 'DOCUMENTO_TIENDA_REPOSITORY',
          useValue: mockTypeormRepo,
        },
      ],
    }).compile();

    repository = module.get<DocumentoTiendaRepository>(
      DocumentoTiendaRepository,
    );
    typeormRepo = module.get('DOCUMENTO_TIENDA_REPOSITORY');
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create and save documentoTienda', async () => {
      const data = {
        tiendaId: 'tienda-1',
        tipo: 'RUT',
        numero: '900123456-1',
        direccion: 'Cra 1 #2-3',
        fechaRecepcion: new Date(),
        validado: false,
      };
      const created = { id: 'documento-1', ...data };
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
    it('should build query and return documentoTiendas', async () => {
      const query: QueryDocumentoTiendaDto = { tiendaId: 'tienda-1' };
      const rows: DocumentoTienda[] = [];
      const queryBuilder = {
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(rows),
      };

      typeormRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await repository.findAll(query);

      expect(typeormRepo.createQueryBuilder).toHaveBeenCalledWith('documento');
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      expect(result).toEqual(rows);
    });
  });

  describe('findById', () => {
    it('should return documentoTienda when found', async () => {
      const row = {
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

      typeormRepo.findOne.mockResolvedValue(row as any);

      const result = await repository.findById('documento-1');

      expect(typeormRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'documento-1' },
      });
      expect(result).toEqual(row);
    });

    it('should return null when documentoTienda not found', async () => {
      typeormRepo.findOne.mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return updated documentoTienda', async () => {
      const updates = { validado: true };
      const updated = {
        id: 'documento-1',
        tiendaId: 'tienda-1',
        tipo: 'RUT',
        numero: '900123456-1',
        direccion: 'Cra 1 #2-3',
        fechaRecepcion: new Date(),
        validado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      typeormRepo.update.mockResolvedValue({ affected: 1 } as any);
      typeormRepo.findOne.mockResolvedValue(updated as any);

      const result = await repository.update('documento-1', updates);

      expect(typeormRepo.update).toHaveBeenCalledWith('documento-1', updates);
      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should delete documentoTienda and return true', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await repository.delete('documento-1');

      expect(typeormRepo.delete).toHaveBeenCalledWith('documento-1');
      expect(result).toBe(true);
    });

    it('should return false when documentoTienda not found', async () => {
      typeormRepo.delete.mockResolvedValue({ affected: 0 } as any);

      const result = await repository.delete('non-existent');

      expect(result).toBe(false);
    });
  });
});
