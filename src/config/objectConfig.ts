import { Injectable } from '@nestjs/common';

@Injectable()
export class ObjectConfig {
  persistence: string;
  environment: string;
  port: number;

  constructor() {
    this.persistence = process.env.PERSISTENCE || 'MONGO';
    this.environment = process.env.NODE_ENV || 'development';
    this.port = parseInt(process.env.PORT, 10) || 3000;
  }
}
