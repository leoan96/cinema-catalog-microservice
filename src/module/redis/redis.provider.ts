import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';

export const REDIS_CLIENT = 'RedisClient';

export const RedisClient = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const redisClientOptions = {
      host: configService.get<string>('redis.host'),
      port: configService.get<number>('redis.port'),
      auth_pass: configService.get<string>('redis.password'),
    };

    const client = redis.createClient(redisClientOptions);
    return client;
  },
  inject: [ConfigService],
};
