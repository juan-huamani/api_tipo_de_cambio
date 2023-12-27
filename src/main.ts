import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  //Usando Fastify
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const config = new DocumentBuilder()
  .setTitle('API de Tasa de Cambio')
  .setDescription('Con esta API puedes consultar un tipo de cambio de una moneda a otra, ademas puedes crear nuevas tasas de cambio')
  .setVersion('1.0')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.getHttpAdapter().getInstance().log.level = 'debug';
  
  await app.listen(3000);
}
bootstrap();
