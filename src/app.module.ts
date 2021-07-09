import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { appEnvironmentConfiguration } from './app.env.configuration';
import { LoggerModule } from './logger/logger.module';
import { CinemaModule } from './module/cinema/cinema.module';
import { mongooseEnvironmentConfiguration } from './module/mongoose/mongoose.configuration';
import { MongooseClient } from './module/mongoose/mongoose.provider';
import { MovieModule } from './module/movie/movie.module';
import { redisEnvironmentConfiguration } from './module/redis/redis.configuration';
import { RedisModule } from './module/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [
        appEnvironmentConfiguration,
        mongooseEnvironmentConfiguration,
        redisEnvironmentConfiguration,
      ],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync(MongooseClient),
    LoggerModule,
    MovieModule,
    RedisModule,
    CinemaModule,
  ],
})
export class AppModule {}
