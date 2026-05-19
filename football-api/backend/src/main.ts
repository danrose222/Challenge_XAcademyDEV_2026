import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.setGlobalPrefix('api');
  
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API de Control de Jugadores')
    .setDescription(
      'Documentación interactiva de la API para la gestión de futbolistas y análisis de estadísticas de rendimiento.'
    )
    .setVersion('1.0')
    .addTag('Players', 'Endpoints relacionados con la gestión y consulta de jugadores')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('portal', app, document);
  

  await app.listen(3000);
  console.log('🚀 Backend corriendo en http://localhost:3000/api');
  console.log('📄 Documentación interactiva en http://localhost:3000/api-docs');
}
bootstrap();