import { v4 as uuidv4 } from 'uuid';
import * as httpContext from 'express-http-context';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export const setCorrelationId = (req, res, next) => {
  const correlationId = uuidv4();
  req.correlationId = correlationId;
  httpContext.set('correlationId', correlationId);
  next();
};

export const verifyBackendToken = (
  request: Request,
  configService: ConfigService,
) => {
  const token = request.headers.authorization?.split(' ')[1];
  const backendToken = configService.get<string>('BACKEND_TOKEN');
  return backendToken === token;
};
