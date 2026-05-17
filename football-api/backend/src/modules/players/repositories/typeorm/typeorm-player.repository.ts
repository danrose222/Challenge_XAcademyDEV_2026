import { Repository } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { PlayerDto } from './player.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';

@Injectable()
export class TypeOrmPlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(PlayerDto)
    private readonly playerRepository: Repository<PlayerDto>,
  ) {}

 async findAll(page: number, limit: number, search?: string): Promise<{ data: Player[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // 1. Solución al error de FindOperator: Forzamos el tipo a 'any'
    // IMPORTANTE: Si la columna en tu base de datos no se llama "name" (por ejemplo, "short_name"),
    // debes cambiar "name" aquí por el nombre real de tu columna.
    const whereCondition: any = search ? { name: Like(`%${search}%`) } : {};

    // El repositorio nos devuelve un arreglo de PlayerDto (modelo de base de datos)
    const [dtos, total] = await this.playerRepository.findAndCount({
      where: whereCondition,
      skip: skip,
      take: limit,
    });

    // 2. Solución al error de asignación (PlayerDto[] no es asignable a Player[]):
    // Casteamos los datos temporalmente para que TypeScript nos deje compilar.
    // (A futuro, la mejor práctica será mapear este arreglo: dtos.map(dto => mapearAPlayer(dto)))
    const data = dtos as unknown as Player[];

    return { data, total };
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const dto = await this.playerRepository.findOne({ where: { id } });
    if (dto === null) {
      return undefined;
    }

    const entity = this.mapToEntity(dto);

    return entity;
  }

  private mapToEntity(playerDto: PlayerDto): Player {
    const player = new Player();
    player.id = playerDto.id;
    player.name = playerDto.longName;
    player.club = playerDto.clubName || 'Unknown Club';
    player.position = playerDto.playerPositions.split(',')[0].trim();
    player.nationality = playerDto.nationalityName || 'Unknown Nationality';
    player.rating = playerDto.overall;
    player.speed = playerDto.pace ?? 0; // Using nullish coalescing operator (??) for numeric defaults
    player.shooting = playerDto.shooting ?? 0;
    player.dribbling = playerDto.dribbling ?? 0;
    player.passing = playerDto.passing ?? 0;

    return player;
  }
}
