import { Injectable, Inject, NotFoundException } from '@nestjs/common';

@Injectable()
export class PlayersService {
  constructor(
    // Inyectamos el repositorio genérico en lugar de atarnos a TypeORM
    @Inject('PlayerRepository')
    private playerRepository: any, 
  ) {}

  async create(playerData: any) {
    return await this.playerRepository.create(playerData);
  }

  async findAllPlayers(page: number, limit: number, search?: string) {
    // Llamamos directamente al método findAll que arreglamos en los repositorios
    return await this.playerRepository.findAll(page, limit, search);
  }

  async getPlayersById(id: number) {
    // Tu repositorio debería tener un método findById (o findOne, ajústalo si es necesario)
    const player = await this.playerRepository.findById(id);
    
    if (!player) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }
    
    return player;
  }
}
