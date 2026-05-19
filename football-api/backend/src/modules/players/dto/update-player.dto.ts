import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePlayerDto {
  @ApiPropertyOptional({ description: 'Nombre completo del jugador', example: 'Lionel Messi' })
  @IsOptional()
  @IsString()
  longName?: string;

  @ApiPropertyOptional({ description: 'Posición en la cancha', example: 'RW' })
  @IsOptional()
  @IsString()
  playerPositions?: string;

  @ApiPropertyOptional({ description: 'Club actual del jugador', example: 'Inter Miami' })
  @IsOptional()
  @IsString()
  clubName?: string;

  @ApiPropertyOptional({ description: 'Nacionalidad', example: 'Argentina' })
  @IsOptional()
  @IsString()
  nationalityName?: string;

  @ApiPropertyOptional({ description: 'Calificación general (Overall)', example: 93 })
  @IsOptional()
  @IsNumber()
  overall?: number;
}
