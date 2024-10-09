// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// The 'jwt' string corresponds to the strategy name defined in JwtStrategy
export class JwtAuthGuard extends AuthGuard('jwt') {}