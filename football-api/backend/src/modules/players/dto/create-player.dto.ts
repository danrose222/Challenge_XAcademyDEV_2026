import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlayerDto {
  @ApiProperty({ description: 'Nombre completo del jugador', example: 'Daniela Rosa Espinoza' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString()
  longName?: string;

  @ApiPropertyOptional({ description: 'Edad del jugador' })
  @IsOptional()
  @IsNumber()
  age?: number; 

  @ApiProperty({ description: 'Posición en la cancha', example: 'CM' })
  @IsNotEmpty({ message: 'La posición es obligatoria' })
  @IsString()
  playerPositions?: string;

  @ApiProperty({ description: 'Club actual del jugador', example: 'XAcademy FC' })
  @IsNotEmpty({ message: 'El club es obligatorio' })
  @IsString()
  clubName?: string;

  @ApiProperty({ description: 'Nacionalidad', example: 'Argentina' })
  @IsNotEmpty({ message: 'La nacionalidad es obligatoria' })
  @IsString()
  nationalityName?: string;

  @ApiProperty({ description: 'Calificación general (Overall)', example: 99 })
  @IsNotEmpty({ message: 'El overall es obligatorio' })
  @IsNumber()
  overall?: number;

  @ApiPropertyOptional({ description: 'Potencial máximo del jugador' })
  @IsOptional()
  @IsNumber()
  potential?: number;

  @ApiPropertyOptional({ description: 'Ritmo' })
  @IsOptional()
  @IsNumber()
  pace?: number;

  @ApiPropertyOptional({ description: 'Tiro' })
  @IsOptional()
  @IsNumber()
  shooting?: number;

  @ApiPropertyOptional({ description: 'Pase' })
  @IsOptional()
  @IsNumber()
  passing?: number;

  @ApiPropertyOptional({ description: 'Regate' })
  @IsOptional()
  @IsNumber()
  dribbling?: number;

  @ApiPropertyOptional({ description: 'Defensa' })
  @IsOptional()
  @IsNumber()
  defending?: number;

  @ApiPropertyOptional({ description: 'Físico' })
  @IsOptional()
  @IsNumber()
  physic?: number;

  @ApiPropertyOptional({ description: 'Versión del FIFA' })
  @IsOptional()
  @IsNumber()
  fifaVersion?: number;

  @ApiPropertyOptional({ description: 'Actualización del FIFA' })
  @IsOptional()
  @IsNumber()
  fifaUpdate?: number;

  @ApiPropertyOptional({ description: 'URL de la cara del jugador' })
  @IsOptional()
  @IsString()
  playerFaceUrl?: string;
}