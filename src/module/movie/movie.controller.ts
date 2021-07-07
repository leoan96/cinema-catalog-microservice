import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/guard/role/role.decorator';
import { Role } from 'src/guard/role/role.enum';
import { RoleGuard } from 'src/guard/role/role.guard';
import { MovieDetails } from './interface/movie.interface';
import { MovieService } from './movie.service';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('')
  @ApiBearerAuth('backendToken')
  @ApiOperation({
    operationId: 'getAllMovies',
    summary: 'Get all movies',
    description:
      'Retrieves all acccount, authorized to signed in users and admins or backend token',
  })
  @ApiOkResponse({
    description: 'Retrieved all movies',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must be signed in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async getAllMovies(): Promise<MovieDetails[]> {
    return await this.movieService.getAllMovies();
  }

  @Get(':id')
  @ApiBearerAuth('backendToken')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Movie id',
    required: true,
  })
  @ApiOperation({
    operationId: 'getMovieById',
    summary: 'Get a specific movie by movie id',
    description:
      'Retrieves a specific movie by movie id, authorized to signed in users and admins or backend token',
  })
  @ApiOkResponse({
    description: 'Retrieved movie of provided movie id',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized to performed this operation. Must be signed in',
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went terribly wrong',
  })
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard, RoleGuard)
  async getMovieById(@Param('id') movieId: string): Promise<MovieDetails> {
    return await this.movieService.getMovieById(movieId);
  }
}
