import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; // <-- ¡Esto faltaba para solucionar el error de InjectModel!
import { PlayerModel } from './repositories/sequelize/player.model';  // <-- ¡Esto faltaba para que reconozca qué es un 'Player'! (Ajustá la ruta si tu entidad se llama distinto)

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerRepository: typeof PlayerModel, // Registramos el repositorio oficial
  ) {}

  // Método 1: Para listar todos los jugadores (el que ya usaba tu tabla)
  async findAll(page: number, limit: number, search?: string): Promise<any> {
    // Acá va la lógica original que ya tenías para buscar todos los jugadores.
    // (Si antes se llamaba de otra forma en tu proyecto, mantené el nombre original)
  }

  // Método 2: Para buscar UN solo jugador por su ID (Para tu gráfico de Radar)
  async findOne(id: number): Promise<any> {
    // Usamos 'playerRepository' que es como lo llamamos en el constructor arriba
    const player = await this.playerRepository.findByPk(id);
    
    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no fue encontrado`);
    }
    
    return player;
  }
}
