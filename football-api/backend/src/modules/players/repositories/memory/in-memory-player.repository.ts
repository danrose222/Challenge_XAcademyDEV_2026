import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

 async findAll(page: number, limit: number, search?: string): Promise<{ data: Player[]; total: number }> {
    let result = this.players; // Asegúrate de que "this.players" sea el nombre de tu arreglo local
    
    if (search) {
      result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    
    const total = result.length;
    const skip = (page - 1) * limit;
    const data = result.slice(skip, skip + limit);
    
    return { data, total };
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return Promise.resolve(this.players.find((p) => p.id === id));
  }
}
