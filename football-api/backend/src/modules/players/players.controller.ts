import { Controller, Get, Param, Query, ParseIntPipe, Res, Patch, Body, Post, UseGuards, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { PlayersService } from './players.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger'; 
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerDto } from './dto/player.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { AiAnalysisService } from './ai-analysis.service';
import { CreatePlayerDto } from './dto/create-player.dto';

@ApiTags('Players') 
@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly aiAnalysisService: AiAnalysisService
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ 
    summary: 'Crear un jugador nuevo en la base de datos',
    description: 'Registra un nuevo futbolista en el sistema. Requiere un token JWT válido en las cabeceras de la petición.'
  })
  @ApiBody({ type: CreatePlayerDto, description: 'Datos del nuevo jugador a registrar' }) 
  @ApiResponse({ status: 201, description: 'Jugador creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o mal formateados.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Token JWT faltante o expirado.' })
  async create(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playersService.create(createPlayerDto);
  }

  @Get('analyze/:id')
  @ApiOperation({ 
    summary: 'Generar diagnóstico de IA para un jugador',
    description: 'Se comunica con el modelo Gemini 2.5 Flash para analizar la evolución histórica de un jugador basándose en sus estadísticas de FIFA y retorna un diagnóstico detallado.'
  })
  @ApiParam({ name: 'id', description: 'El identificador único numérico del jugador en la base de datos', type: 'number', example: 16183 })
  @ApiResponse({ status: 200, description: 'Diagnóstico generado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Jugador no encontrado en la base de datos.' })
  @ApiResponse({ status: 500, description: 'Error de conexión con el servicio de IA.' })
  async getPlayerAnalysis(@Param('id', ParseIntPipe) id: number) {
    const player = await this.playersService.findOne(id);
    
    const historial = [
      { year: 2021, value: player.overall - 2 },
      { year: 2022, value: player.overall - 1 },
      { year: 2023, value: player.overall }
    ];

    return await this.aiAnalysisService.analizarEvolucion(historial);
  }

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
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename=jugadores.csv',
    });
    
    res.send(buffer);
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

  @Get(':id/history')
  @ApiOperation({ summary: 'Obtener el historial de un jugador' })
  @ApiParam({ name: 'id', description: 'ID del jugador', type: 'string' })
  @ApiResponse({ status: 200, description: 'Historial devuelto con éxito.' })
  async getPlayerHistory(@Param('id') id: string) {
    return this.playersService.getPlayerHistory(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un jugador de la base de datos' })
  @ApiParam({ name: 'id', description: 'ID del jugador a eliminar', type: 'string' })
  @ApiResponse({ status: 200, description: 'Jugador eliminado con éxito.' })
  remove(@Param('id') id: string) {
    return this.playersService.remove(+id);
  }

  @Post('import')
  @ApiOperation({ summary: 'Importar lista de jugadores masivamente vía CSV' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({                          
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 500 * 1024 * 1024,
    },
  }))
  async uploadFile(@UploadedFile() file: any) {
    console.log('🚩 ¡El controlador recibió una petición POST a /import!');
    console.log('📦 Estado del archivo:', file ? 'Archivo recibido correctamente' : 'El archivo es undefined/nulo');

    if (!file) {
      throw new Error('No se subió ningún archivo.');
    }
    return await this.playersService.importarDesdeCsv(file);
  }
}