import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.setGlobalPrefix('api');
  
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('API de Control de Jugadores')
    .setDescription(
      'Documentación interactiva de la API para la gestión de futbolistas y análisis de estadísticas de rendimiento.'
    )
    .setVersion('1.0')
    .addTag('Players', 'Endpoints relacionados con la gestión y consulta de jugadores')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(3000);
  console.log('🚀 Backend corriendo en http://localhost:3000/api');
  console.log('📄 Documentación interactiva en http://localhost:3000/api-docs');
}
bootstrap();