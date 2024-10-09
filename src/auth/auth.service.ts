// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service'; // Assuming you have a UsersService
import { BcryptHashUtil } from '../common/utils/bcrypt-hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await BcryptHashUtil.comparePassword(password, user.password))) {
      // Exclude sensitive information
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Generate JWT token
  async login(user: any) {
    const payload = { email: user.email, sub: user.userId, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

