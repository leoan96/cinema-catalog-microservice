import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CinemaController } from './cinema.controller';
import { CinemaService } from './cinema.service';
import {
  CinemaPremier,
  CinemaPremierSchema,
} from './schema/cinema-premier.schema';
import { Cinema, CinemaSchema } from './schema/cinema.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cinema.name, schema: CinemaSchema },
      { name: CinemaPremier.name, schema: CinemaPremierSchema },
    ]),
  ],
  controllers: [CinemaController],
  providers: [CinemaService],
})
export class CinemaModule {}
