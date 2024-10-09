// src/main.ts
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set up the view engine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Optional: Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Optional: If you need to configure hbs further
  // app.engine('hbs', hbs.__express);
  // hbs.registerPartials(join(__dirname, '..', 'views/partials'));

  await app.listen(3000);
}
bootstrap();
