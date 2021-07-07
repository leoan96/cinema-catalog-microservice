import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';
import { REDIS_CLIENT } from '../redis.provider';

@Injectable()
export class RedisPromiseService {
  constructor(@Inject(REDIS_CLIENT) private readonly client: RedisClient) {}

  // promisify redis: https://noahkreiger.medium.com/nodejs-redis-setting-it-up-asynchronously-ba8db73e07de

  async get(key: string): Promise<string> {
    const get = promisify(this.client.get).bind(this.client);
    return await get(key);
  }

  async set(key: string, value: string): Promise<string> {
    const set = promisify(this.client.set).bind(this.client);
    return await set(key, value);
  }

  async del(key: string): Promise<void> {
    const del = promisify(this.client.del).bind(this.client);
    await del(key);
  }
}
