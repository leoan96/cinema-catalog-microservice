import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectID } from 'mongodb';
import { Model } from 'mongoose';
import { Cinema, CinemaDocument } from './schema/cinema.schema';

@Injectable()
export class CinemaService {
  constructor(
    @InjectModel(Cinema.name)
    private readonly cinemaModel: Model<CinemaDocument>,
  ) {}

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
    const cinema: CinemaDocument[] = await this.cinemaModel.aggregate([
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

    if (!Array.isArray(cinema) || !cinema.length) {
      throw new BadRequestException('Invalid cinema id');
    }
    return cinema;
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
