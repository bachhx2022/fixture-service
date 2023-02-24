import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Seeder } from './matches/seeder';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('Fixtures Service')
    .setDescription('The Fixtures APIs')
    .setVersion('1.0')
    .addTag('Fixtures')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // allow cors
  app.enableCors();

  // seeding data
  const seeder = app.get(Seeder);
  await seeder.seed();

  // start app
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
