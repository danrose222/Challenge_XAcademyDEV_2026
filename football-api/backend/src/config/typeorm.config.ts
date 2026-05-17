import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PlayerDto } from 'src/modules/players/repositories/typeorm/player.dto';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'nestjs_user',
  password: 'nestjs_password',
  database: 'nestjs_database',
  entities: [PlayerDto],
  synchronize: true,
};

export default typeOrmConfig;
