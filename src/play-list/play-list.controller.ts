import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { PlayListService } from './play-list.service';
import { CreatePlayListRequest } from './request/create-play-list.request';
import { Playlist } from 'src/models/playlist.entity';

@Controller('play-list')
export class PlayListController {
  constructor(private readonly playListService: PlayListService) {}

  @Post()
  async create(
    @Body() playListRequest: CreatePlayListRequest,
  ): Promise<Playlist> {
    try {
      return this.playListService.create(playListRequest);
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }
}
