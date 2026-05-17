import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

@Get()
async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search?: string) {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  // Cambiamos 'findAllPlayers' por 'findAll' para que coincida con el Service
  return await this.playersService.findAll(pageNumber, limitNumber, search);
}

  @Get(':id')
async getPlayerById(@Param('id') id: number) {
  // Cambiamos 'getPlayersById' por 'findOne' para que coincida con el Service
  return await this.playersService.findOne(id);
}
}
