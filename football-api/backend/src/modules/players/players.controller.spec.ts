import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

describe('PlayersController', () => {
  let controller: PlayersController;

  const mockPlayersService = {
    
    findAll: jest.fn().mockResolvedValue([
      { id: 1, name: 'Lionel Messi', position: 'Forward' },
      { id: 2, name: 'Dibu Martinez', position: 'Goalkeeper' }
    ]),
  };

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('El controlador debería estar definido y listo para usarse', () => {
    expect(controller).toBeDefined();
  });

  it('Debería devolver la lista de jugadores simulada', async () => {

    const result = await controller.findAll(); 
    
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Lionel Messi');
  });
});