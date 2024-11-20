import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { document } from './lib/sweager-docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  SwaggerModule.setup('api-docs', app, document(app), {
    jsonDocumentUrl: '/api-json',
  });
  console.log('server run in port 3000');
  console.log('server jalan dong');
  await app.listen(3000);
}
bootstrap();
