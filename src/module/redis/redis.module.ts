import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from './redis.provider';
import { RedisConnectService } from './service/redis-connect.service';
import { RedisPromiseService } from './service/redis-promise.service';

@Module({
  imports: [ConfigModule],
  providers: [RedisClient, RedisPromiseService, RedisConnectService],
  exports: [RedisPromiseService, RedisConnectService],
})
export class RedisModule {}
