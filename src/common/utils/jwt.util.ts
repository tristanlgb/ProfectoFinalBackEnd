import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtUtil {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default_secret';

  signToken(payload: any, expiresIn: string = '1h'): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }
}
