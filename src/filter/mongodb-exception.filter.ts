import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as httpContext from 'express-http-context';
import * as moment from 'moment';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MongoExceptionFilter.name);

  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();

    const timestamp = +moment();
    const time = new Date().toUTCString();
    const correlationId: string = httpContext.get('correlationId');

    const statusCode = +exception.code;

    const systemErrorMessage = exception.message;
    const method = request.method;
    const exceptionStack = exception.stack;

    let userErrorMessage;
    switch (statusCode) {
      case 11000:
        userErrorMessage = 'Duplicate key';
        break;
      default:
        userErrorMessage = 'Database error ... please try again later';
    }

    const errorResponse = {
      timestamp,
      time,
      correlationId,
      statusCode,
      message: userErrorMessage,
    };

    const loggerErrorResponse = {
      timestamp,
      time,
      correlationId,
      statusCode,
      method,
      systemErrorMessage,
      exceptionStack,
    };

    this.logger.error(JSON.stringify(loggerErrorResponse));
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
