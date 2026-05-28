// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { BcryptHashUtil } from '../common/utils/bcrypt-hash.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await BcryptHashUtil.comparePassword(
      password,
      user.password,
    );

    if (!isValidPassword) {
      return null;
    }

    const userObject = user.toObject();
    const { password: _password, ...result } = userObject;

    return result;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
