import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { RedisPromiseService } from '../redis/service/redis-promise.service';
import { Cinema, CinemaDocument } from './schema/cinema.schema';
@Injectable()
export class CinemaService {
  constructor(
    @InjectModel(Cinema.name)
    private readonly cinemaModel: Model<CinemaDocument>,
    private readonly redisPromiseService: RedisPromiseService,
  ) {}

  private logger = new Logger(CinemaService.name);

  async getCinemasByCity(cityId: string): Promise<CinemaDocument[]> {
    const cinemas: CinemaDocument[] = await this.cinemaModel.aggregate([
      { $match: { city_id: cityId } },
      {
        $project: {
          name: '$name',
        },
      },
    ]);

    if (!Array.isArray(cinemas) || !cinemas.length) {
      throw new BadRequestException('Invalid city id');
    }
    return cinemas;
  }

  async getCinemaMoviePremieresByCinemaId(
    cinemaId: string,
  ): Promise<CinemaDocument[]> {
    const redisCinemaId = `cinemaId:${cinemaId}`;
    try {
      const moviePremiereString: string = await this.redisPromiseService.get(
        redisCinemaId,
      );

      if (moviePremiereString) {
        return JSON.parse(moviePremiereString);
      }
    } catch (err) {
      this.logger.error(err);
    }

    const moviePremieres: CinemaDocument[] = await this.cinemaModel.aggregate([
      {
        $match: { _id: new ObjectID(cinemaId) },
      },
      {
        $project: {
          name: '$name',
          cinemaPremieres: '$cinemaPremieres',
        },
      },
    ]);

    if (!Array.isArray(moviePremieres) || !moviePremieres.length) {
      throw new BadRequestException('Invalid cinema id');
    }

    this.redisPromiseService.set(redisCinemaId, JSON.stringify(moviePremieres));

    return moviePremieres;
  }

  async getCinemaScheduleByMovie({
    cityId,
    movieId,
  }): Promise<CinemaDocument[]> {
    const match = {
      $match: {
        city_id: cityId,
        'cinemaRooms.schedules.movie_id': movieId,
      },
    };
    const project = {
      $project: {
        name: 1,
        'cinemaRooms.schedules.time': 1,
        'cinemaRooms.name': 1,
        'cinemaRooms.format': 1,
      },
    };
    const unwind = [
      { $unwind: '$cinemaRooms' },
      { $unwind: '$cinemaRooms.schedules' },
    ];
    const group = [
      {
        $group: {
          _id: {
            name: '$name',
            room: '$cinemaRooms.name',
          },
          schedules: { $addToSet: '$cinemaRooms.schedules.time' },
        },
      },
      {
        $group: {
          _id: '$_id.name',
          schedules: {
            $addToSet: {
              room: '$_id.room',
              schedules: '$schedules',
            },
          },
        },
      },
    ];

    const cinemas = await this.cinemaModel.aggregate([
      match,
      project,
      ...unwind,
      ...group,
    ]);

    if (!Array.isArray(cinemas) || !cinemas.length) {
      throw new BadRequestException('Empty');
    }
    return cinemas;
  }
}
