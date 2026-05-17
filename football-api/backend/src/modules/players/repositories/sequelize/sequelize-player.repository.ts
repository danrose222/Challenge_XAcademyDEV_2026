    import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './player.model'; 
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { Op } from 'sequelize';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  
 async findAll(page: number, limit: number, search?: string): Promise<{ data: Player[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const { rows, count } = await this.playerModel.findAndCountAll({
      limit: limit,
      offset: skip,
    });

    return { data: rows as any, total: count };
  }

  async findById(id: number): Promise<any> {
    // Buscamos en la base de datos por la clave primaria (ID)
    return await this.playerModel.findByPk(id);
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) return undefined;
    return this.mapToEntity(model);
  }

  private mapToEntity(model: PlayerModel): Player {
    const player = new Player();
    player.id = model.id;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;
    return player;
  }
}
