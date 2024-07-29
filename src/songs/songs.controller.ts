import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongRequest } from './request/createSong.request';
import { Song } from 'src/models/song.entity';
import { UpdateSongRequest } from './request/updateSong.request';
import { UpdateResult } from 'typeorm';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit: number = 10,
  ) {
    try {
      limit = limit > 100 ? 100 : limit;
      return this.songsService.findAllWithPaginate({ page, limit });
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }

  @Post()
  @UseGuards(JwtArtistGuard)
  create(@Body() createSongRequest: CreateSongRequest): Promise<Song> {
    try {
      return this.songsService.create(createSongRequest);
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    try {
      return this.songsService.findOne(id);
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Put(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateSongRequest: UpdateSongRequest,
  ): Promise<UpdateResult> {
    try {
      return this.songsService.updateElement(id, updateSongRequest);
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }

  @Delete(':id')
  destroy(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    try {
      this.songsService.removeElement(id);
      return 'Remove success';
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.BAD_REQUEST, {
        cause: error,
      });
    }
  }
}
