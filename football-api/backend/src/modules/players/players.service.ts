import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './repositories/sequelize/player.model';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerRepository: typeof PlayerModel,
  ) {}

  // Agregamos los parámetros de nationality y position que vienen del controlador
  async findAll(page: number, limit: number, nationality?: string, position?: string): Promise<any> {
    
    const offset = (page - 1) * limit;
    
    // 1. Creamos el objeto de condiciones vacío
    const whereCondition: any = {};

    // 2. Filtro dinámico: Si el usuario mandó país, lo sumamos
    if (nationality) {
      whereCondition.nationalityName = nationality; // <-- ACÁ ESTÁ LA MAGIA
    }

    // 3. Filtro dinámico: Si el usuario mandó posición, la sumamos
    if (position) {
      whereCondition.playerPositions = position; // <-- Y ACÁ TAMBIÉN
    }
   
    // 4. Se lo pasamos a Sequelize (agregando la propiedad "where")
    const { rows, count } = await this.playerRepository.findAndCountAll({
      where: whereCondition, // <--- ¡Acá ocurre la magia!
      limit: limit,
      offset: offset,
    });

    return {
      data: rows,
      total: count,
      page: page,
      totalPages: Math.ceil(count / limit)
    };
  }

  async findOne(id: number): Promise<any> {
   
    const player = await this.playerRepository.findByPk(id);
    
    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no fue encontrado`);
    }
    
    return player;
  }
}