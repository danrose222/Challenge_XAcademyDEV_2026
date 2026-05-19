import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './repositories/sequelize/player.model';
import { Op } from 'sequelize'; 
import * as xlsx from 'xlsx';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerRepository: typeof PlayerModel,
  ) {}

  async findAll(page: number, limit: number, nationality?: string, position?: string, name?: string, club?: string): Promise<any> {
    
    const offset = (page - 1) * limit;
    const whereCondition: any = {};

    if (nationality) {
      whereCondition.nationalityName = nationality;
    }

    if (position) {
      whereCondition.playerPositions = position;
    }

    if (name) {
      
      whereCondition.longName = { [Op.like]: `%${name}%` }; 
    }

    if (club) {
      whereCondition.clubName = { [Op.like]: `%${club}%` };
    }
   
    const { rows, count } = await this.playerRepository.findAndCountAll({
      where: whereCondition, 
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

  async exportCsv(nationality?: string, position?: string, name?: string, club?: string): Promise<Buffer> {
    
    const whereCondition: any = {};
    if (nationality) whereCondition.nationalityName = nationality;
    if (position) whereCondition.playerPositions = position;
    if (name) whereCondition.longName = { [Op.like]: `%${name}%` };
    if (club) whereCondition.clubName = { [Op.like]: `%${club}%` };

    
    const players = await this.playerRepository.findAll({ where: whereCondition });

    
    const dataToExport = players.map(p => ({
      ID: p.id,
      Nombre: p.longName,
      Nacionalidad: p.nationalityName,
      Club: p.clubName,
      Posicion: p.playerPositions,
      Valor_Eur: p.valueEur
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Jugadores');

    
    const csvBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    
    return csvBuffer;
  }

  async findOne(id: number): Promise<any> {
   
    const player = await this.playerRepository.findByPk(id);
    
    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no fue encontrado`);
    }
    
    return player;
  }
}