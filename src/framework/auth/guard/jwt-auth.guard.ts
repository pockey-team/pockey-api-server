import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

import { TokenExpiredException } from '../../../application/common/error/exception';
import { isPublicRoute } from '../util/guard.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublicRoute(this.reflector, context)) {
      return true;
    }

    const token = this.extractTokenFromRequest(context);
    if (!token) {
      return false;
    }

    const payload = await this.validateToken(token);
    if (!payload) {
      return false;
    }

    const refreshToken = payload.refreshToken ? token : null;
    this.setUserToRequest(context, { ...payload, refreshToken });
    return true;
  }

  private extractTokenFromRequest(context: ExecutionContext): string | null {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  private async validateToken(token: string) {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new TokenExpiredException();
      }
      return null;
    }
  }

  private setUserToRequest(context: ExecutionContext, payload: any): void {
    const request = context.switchToHttp().getRequest();
    request.user = { ...payload, refreshToken: payload.refreshToken };
  }
}
