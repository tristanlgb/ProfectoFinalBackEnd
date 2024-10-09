import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ObjectConfig } from './objectConfig';

@Module({
  imports: [NestConfigModule.forRoot()],
  providers: [ObjectConfig],
  exports: [ObjectConfig],
})
export class ConfigModule {}
