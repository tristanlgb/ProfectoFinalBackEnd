// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      // Extract JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Optionally, extract JWT from cookies
      // jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
      //   return request?.cookies?.authToken;
      // }]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    } as StrategyOptions);
  }

  async validate(payload: any) {
    // The payload contains the decoded JWT data
    // You can perform additional validation or fetch the user from the database
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
