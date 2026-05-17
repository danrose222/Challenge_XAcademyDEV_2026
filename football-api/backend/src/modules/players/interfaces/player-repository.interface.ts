import { Player } from '../entities/player.entity';

export interface IPlayerRepository {
  
  findAll(page: number, limit: number, search?: string): Promise<{ data: Player[], total: number }>;
  
  findOneById(id: number): Promise<Player | undefined>;
}