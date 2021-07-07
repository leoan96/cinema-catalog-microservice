import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verifyBackendToken } from '../shared/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    return this.validateSession(request);
  }

  private validateSession(request: Request): boolean {
    const verifiedBackendToken = verifyBackendToken(
      request,
      this.configService,
    );

    return !!request.session['userId'] || verifiedBackendToken;
  }
}
