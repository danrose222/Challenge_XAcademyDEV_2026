import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Player } from './modules/players/entities/player.entity';
import { PlayersModule } from './modules/players/players.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'mysql_db',
      port: 3306,
      username: 'football_api',
      password: 'password',
      database: 'football_db',
      models: [Player],
      autoLoadModels: true,
      synchronize: false,
    }),

    
    PlayersModule,
  ],
})
export class AppModule {}