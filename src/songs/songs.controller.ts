import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongRequest } from './request/createSong.request';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll() {
    try {
      return this.songsService.findAll();
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }

  @Post()
  create(@Body() createSongRequest: CreateSongRequest) {
    return this.songsService.create(createSongRequest);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return `find song base id with type is ${typeof id}`;
  }

  @Put(':id')
  update() {
    return 'update song base id';
  }

  @Delete(':id')
  destroy() {
    return 'Delete song base id';
  }
}
