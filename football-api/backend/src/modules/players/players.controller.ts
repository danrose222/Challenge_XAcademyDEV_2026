import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { PlayersService } from './players.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger'; 

@ApiTags('Players') 
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener el listado paginado de jugadores' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página a consultar', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de registros por página', example: 10 })
  @ApiQuery({ name: 'nationality', required: false, description: 'Filtrar por nombre del país (Ej: Brazil, Argentina)' })
  @ApiQuery({ name: 'position', required: false, description: 'Filtrar por posición en la cancha (Ej: Forward, Goalkeeper)' })
  @ApiResponse({ status: 200, description: 'Listado de jugadores devuelto con éxito.' })
  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('nationality') nationality?: string,
    @Query('position') position?: string,
  ) {
    return await this.playersService.findAll(page, limit, nationality, position);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un jugador específico por su identificador único (ID)' })
  @ApiResponse({ status: 200, description: 'Jugador encontrado y mapeado con éxito.' })
  @ApiResponse({ status: 404, description: 'El ID ingresado no corresponde a ningún jugador en la base de datos.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }
}
