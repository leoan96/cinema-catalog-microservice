import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDetails } from './interface/movie.interface';
import { Movie } from './movie.schema';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDetails>,
  ) {}

  async getAllMovies(): Promise<Movie[]> {
    return await this.movieModel.find({});
  }

  async getMovieById(movieId: string): Promise<MovieDetails> {
    return await this.movieModel.findById(movieId);
  }
}
