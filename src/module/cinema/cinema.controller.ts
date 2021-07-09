import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CinemaService } from './cinema.service';
import { CinemaDocument } from './schema/cinema.schema';

@ApiTags('catalog')
@Controller('cinemas')
export class CinemaController {
  constructor(private readonly cinemaService: CinemaService) {}

  @Get('city/:cityId')
  @ApiOperation({
    operationId: 'getCinemasByCity',
    summary: 'Retrieve all cinemas by city',
    description:
      'Retrieves all cinemas by city, no roles required to perform this operation',
  })
  @ApiOkResponse({
    description: 'Retrieved all cinemas by city',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  async getCinemasByCity(
    @Param('cityId') cityId: string,
  ): Promise<CinemaDocument[]> {
    return await this.cinemaService.getCinemasByCity(cityId);
  }

  @ApiOperation({
    operationId: 'getCinemaMoviePremieresByCinemaId',
    summary: 'Retrieve all movie premieres for cinema of given id',
    description:
      'Retrieve all movie premieres for cinema of given id, no roles required to perform this operation',
  })
  @ApiOkResponse({
    description: 'Retrieved all movie premieres for cinema of given id',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':cinemaId')
  async getCinemaMoviePremieresByCinemaId(
    @Param('cinemaId') cinemaId: string,
  ): Promise<CinemaDocument[]> {
    return await this.cinemaService.getCinemaMoviePremieresByCinemaId(cinemaId);
  }

  @ApiOperation({
    operationId: 'getCinemaScheduleByMovie',
    summary: 'Retrieves all cinema schedules by movie id',
    description:
      'Retrieves all cinema schedules by movie id, no roles required to perform this operation',
  })
  @ApiParam({
    name: 'cityId',
    type: String,
    description: 'City id',
    required: true,
  })
  @ApiParam({
    name: 'movieId',
    type: String,
    description:
      'Refer to cinemaPremier.id from Cinema schema (i.e. movieId = 1)',
    required: true,
  })
  @ApiOkResponse({
    description: 'Retrieved all cinema schedules by movie id',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Get(':cityId/:movieId')
  async getCinemaScheduleByMovie(@Param() { cityId, movieId }) {
    return await this.cinemaService.getCinemaScheduleByMovie({
      cityId,
      movieId,
    });
  }
}
