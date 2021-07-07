import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { REDIS_CLIENT } from '../redis.provider';
import { ConfigService } from '@nestjs/config';
import { appConfiguration } from 'src/app.configuration';

@Injectable()
export class RedisConnectService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly client: RedisClient,
    private readonly configService: ConfigService,
  ) {}

  async getRedisSession() {
    const RedisStore = connectRedis(session);
    const appConfig = appConfiguration(this.configService);
    const sessionOptions = {
      ...appConfig.session,
      store: new RedisStore({
        client: this.client,
      }),
    };
    return await session(sessionOptions);
  }
}
