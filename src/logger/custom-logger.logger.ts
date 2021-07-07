import { Logger } from '@nestjs/common';

export class CustomLogger extends Logger {
  error(message: string, trace: string) {
    super.error(message, trace);
  }
}
