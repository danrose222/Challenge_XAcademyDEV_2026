import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize'; // <-- ¡Esto faltaba para solucionar el error de InjectModel!
import { PlayerModel } from './repositories/sequelize/player.model';  // <-- ¡Esto faltaba para que reconozca qué es un 'Player'! (Ajustá la ruta si tu entidad se llama distinto)

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerRepository: typeof PlayerModel, // Registramos el repositorio oficial
  ) {}

  // En src/modules/players/players.service.ts

// ... tu constructor y el método findOne se quedan igual ...

  // Método para listar todos los jugadores (El que usa tu tabla principal)
  async findAll(page: number, limit: number, search?: string): Promise<any> {
    // 1. Usamos el repositorio para traer los datos reales de la base de datos
    // Nota: Si usas paginación o filtros, Sequelize usa findAndCountAll
    const offset = (page - 1) * limit;
    
    // Si hay una búsqueda por nombre, puedes aplicarla acá, 
    // pero para destrabar la pantalla traigamos los registros base:
    const { rows, count } = await this.playerRepository.findAndCountAll({
      limit: limit,
      offset: offset,
    });

    // 2. Devolvemos el objeto que tu tabla de Angular espera recibir
    return {
      data: rows,
      total: count,
      page: page,
      totalPages: Math.ceil(count / limit)
    };
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
