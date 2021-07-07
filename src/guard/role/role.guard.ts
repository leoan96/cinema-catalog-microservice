import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verifyBackendToken } from '../../shared/utils';
import { ExpressSessionUser } from './role.interface';
import { ROLES_KEY } from './role.decorator';
import { Role } from './role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedRoles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const session: ExpressSessionUser = request.session;

    // if (!session?.user) {
    //   throw new Error('To be replaced with custom error');
    // }

    const verifiedBackendToken = verifyBackendToken(
      request,
      this.configService,
    );
    const verifiedARequiredRoles = allowedRoles.some((role) =>
      session.user?.role?.includes(role),
    );

    return verifiedARequiredRoles || verifiedBackendToken;
  }
}
