import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtUtil: JwtUtil) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['authToken'] || req.headers['authorization'];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.jwtUtil.verifyToken(token);
      req['user'] = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
