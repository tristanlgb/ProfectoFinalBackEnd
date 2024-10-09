import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomConfigService {
  constructor(private configService: ConfigService) {}

  get(key: string): string {
    return this.configService.get<string>(key);
  }
}
