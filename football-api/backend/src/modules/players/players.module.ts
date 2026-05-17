import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { SequelizePlayerRepository } from './repositories/sequelize/sequelize-player.repository';

// 1. Apuntamos a la carpeta correcta donde descubrimos que vive el modelo de Sequelize
import { PlayerModel } from './repositories/sequelize/player.model'; 

@Module({
  // 2. Registramos el modelo
  imports: [SequelizeModule.forFeature([PlayerModel])], 
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