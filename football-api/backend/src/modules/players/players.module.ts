import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { SequelizePlayerRepository } from './repositories/sequelize/sequelize-player.repository';
import { PlayerModel } from './repositories/sequelize/player.model'; 
import { AuthModule } from '../../auth/auth.module';

@Module({
  
  imports: [AuthModule, SequelizeModule.forFeature([PlayerModel])], 
  controllers: [PlayersController],
  providers: [
    PlayersService,
    {
      provide: 'PlayerRepository',
      useClass: SequelizePlayerRepository,
    },
  ],
})
export class PlayersModule {}