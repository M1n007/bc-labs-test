import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'common/interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.configService.get('IGNORE_AUTH_GUARD')) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }


    try {
      const decoded = this.jwtService.verify<TokenPayload>(token);

      if (decoded) {
        request.user = {
          id: decoded.sub
        };
        return true;
      }
    } catch (_err) {
      return false;
    }
    return Promise.resolve(false);
  }

}