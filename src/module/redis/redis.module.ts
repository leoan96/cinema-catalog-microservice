import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from './redis.provider';
import { RedisPromiseService } from './redis-promise.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisClient, RedisPromiseService],
  exports: [RedisPromiseService],
})
export class RedisModule {}
