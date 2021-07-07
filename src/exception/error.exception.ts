import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(error) {
    super(error, HttpStatus.BAD_REQUEST);
  }
}
