import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlayerModel } from './repositories/sequelize/player.model';
import { Op } from 'sequelize'; 
import * as xlsx from 'xlsx';
import { UpdatePlayerDto } from './dto/update-player.dto';
// @ts-ignore
import * as csv from 'csv-parser';
import { Readable } from 'stream';

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
      order: [['overall', 'DESC']]
    });

    const datosSaneados = rows.map(p => {
      
      const player = p.get({ plain: true }); 
      
      if (player.longName) player.longName = this.sanearTexto(player.longName);
      if (player.clubName) player.clubName = this.sanearTexto(player.clubName);
      if (player.nationalityName) player.nationalityName = this.sanearTexto(player.nationalityName);
      
      return player;
    });

    return {
      data: datosSaneados,
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
      Nombre: this.sanearTexto(p.longName),
      Nacionalidad: this.sanearTexto(p.nationalityName),
      Club: this.sanearTexto(p.clubName),
      Posicion: p.playerPositions,
      Valor_Eur: p.valueEur
    }));

    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Jugadores');

    const csvBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'csv' });
    
    const bom = Buffer.from('\uFEFF', 'utf-8');
    
    return Buffer.concat([bom, csvBuffer]);
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto): Promise<any> {
    const player = await this.playerRepository.findByPk(id);
    
    if (!player) {
      throw new NotFoundException(`El jugador con ID ${id} no existe en la base de datos.`);
    }

    await player.update(updatePlayerDto);
    return player;
  }

  async create(playerData: any): Promise<any> {
    const newPlayer = await this.playerRepository.create(playerData);
    return newPlayer;
  }

  async findOne(id: number): Promise<any> {
    const player = await this.playerRepository.findByPk(id);
    
    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no fue encontrado`);
    }
    
    return player;
  }

   async remove(id: number): Promise<void> {
    const player = await this.playerRepository.findByPk(id);
    if (!player) {
      throw new Error('Jugador no encontrado');
    }
    await player.destroy();
  }

  private sanearTexto(texto: string | undefined | null): string {
    if (!texto) return '';
    try {
      return decodeURIComponent(escape(texto));
    } catch (e) {
      return texto; 
    }
  }

  async importarDesdeCsv(file: any): Promise<any> {
    console.log('⚙️ Iniciando lectura por Streaming (Flujo de datos)...');

    return new Promise((resolve, reject) => {
      const jugadoresAInsertar: any[] = [];
      const stream = Readable.from(file.buffer);

      stream
        .pipe(csv())
        .on('data', (row) => {
          jugadoresAInsertar.push({
            fifaVersion: row['fifa_version'],
            fifaUpdate: row['fifa_update'],
            playerFaceUrl: row['player_face_url'],
            longName: row['long_name'],
            playerPositions: row['player_positions'],
            clubName: row['club_name'],
            nationalityName: row['nationality_name'],
            overall: row['overall'],
            potential: row['potential'],
            valueEur: row['value_eur'],
            wageEur: row['wage_eur'],
            age: row['age'],
            heightCm: row['height_cm'],
            weightKg: row['weight_kg'],
            preferredFoot: row['preferred_foot'],
            weakFoot: row['weak_foot'],
            skillMoves: row['skill_moves'],
            internationalReputation: row['international_reputation'],
            workRate: row['work_rate'],
            bodyType: row['body_type'],
            pace: row['pace'],
            shooting: row['shooting'],
            passing: row['passing'],
            dribbling: row['dribbling'],
            defending: row['defending'],
            physic: row['physic'],
          });
        })
        .on('end', async () => {
          console.log(`✅ Lectura veloz terminada: ${jugadoresAInsertar.length} jugadores encontrados. Guardando en MySQL...`);
          
          try {

            const tamañoLote = 1000;
            let insertados = 0;

            for (let i = 0; i < jugadoresAInsertar.length; i += tamañoLote) {
              const lote = jugadoresAInsertar.slice(i, i + tamañoLote);
              
              await this.playerRepository.bulkCreate(lote as any[], {
                logging: false,
                ignoreDuplicates: true,
              });
              
              insertados += lote.length;
              console.log(`Progreso de carga: ${insertados} jugadores guardados...`);
            }
            
            resolve({ mensaje: `¡Misión cumplida! ${insertados} jugadores procesados por streaming y guardados.` });
          } catch (error) {
            console.error('Error guardando en la BD:', error);
            reject(new Error('Falló la inserción en la base de datos.'));
          }
        })
        .on('error', (error) => {
          console.error('Error al leer el stream del CSV:', error);
          reject(new Error('Falló la lectura del archivo.'));
        });
    });
  }

   async getPlayerHistory(id: number) {
    const currentPlayer = await this.playerRepository.findOne({ where: { id } });
    
    if (!currentPlayer) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    const history = await this.playerRepository.findAll({
      where: { 
        longName: currentPlayer.longName 
      },
      order: [
        ['fifaVersion', 'ASC']
      ]
    });

    return history;
  }
}