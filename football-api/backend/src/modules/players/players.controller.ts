import { Controller, Get, Param, Query, ParseIntPipe, Res, Patch, Body, Post, UseGuards, Delete} from '@nestjs/common';
import { Response } from 'express';
import { PlayersService } from './players.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger'; 
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerDto } from './dto/player.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Players') 
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

 @Get()
  @ApiOperation({ summary: 'Obtener el listado paginado de jugadores' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página a consultar', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de registros por página', example: 10 })
  @ApiQuery({ name: 'nationality', required: false, description: 'Filtrar por nombre del país (Ej: Brazil)' })
  @ApiQuery({ name: 'position', required: false, description: 'Filtrar por posición (Ej: ST, GK)' })
  @ApiQuery({ name: 'name', required: false, description: 'Buscar por nombre parcial (Ej: Messi)' })
  @ApiQuery({ name: 'club', required: false, description: 'Buscar por club parcial (Ej: Paris)' })
  @ApiResponse({ status: 200, description: 'Listado de jugadores devuelto con éxito.' })

  async findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 20,
    @Query('nationality') nationality?: string,
    @Query('position') position?: string,
    @Query('name') name?: string,
    @Query('club') club?: string,
  ) {

    return await this.playersService.findAll(page, limit, nationality, position, name, club);
    
  }


  @Get('export')
  @ApiOperation({ summary: 'Exportar jugadores filtrados a CSV' })

  async exportCsv(
    @Res() res: Response,
    @Query('nationality') nationality?: string,
    @Query('position') position?: string,
    @Query('name') name?: string,
    @Query('club') club?: string,
  ) {
    const buffer = await this.playersService.exportCsv(nationality, position, name, club);
    
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=jugadores.csv',
    });
    
    res.send(buffer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Crear un jugador nuevo en la base de datos' })
  @ApiBody({ type: PlayerDto, description: 'Datos del nuevo jugador' }) 
  @ApiResponse({ status: 201, description: 'Jugador creado exitosamente.' })

  async create(
  
    @Body() playerData: PlayerDto) {
    return await this.playersService.create(playerData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un jugador específico por su identificador único (ID)' })
  @ApiResponse({ status: 200, description: 'Jugador encontrado y mapeado con éxito.' })
  @ApiResponse({ status: 404, description: 'El ID ingresado no corresponde a ningún jugador en la base de datos.' })

  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Editar la información de un jugador existente' })
  @ApiBody({ type: UpdatePlayerDto, description: 'Datos a modificar del jugador' })
  @ApiResponse({ status: 200, description: 'Jugador actualizado con éxito.' })

  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ) {
    return await this.playersService.update(id, updatePlayerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }
  
}
