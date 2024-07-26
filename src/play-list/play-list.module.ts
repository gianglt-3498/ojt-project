import { Module } from '@nestjs/common';
import { PlayListController } from './play-list.controller';
import { PlayListService } from './play-list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from 'src/models/playlist.entity';
import { Song } from 'src/models/song.entity';
import { User } from 'src/models/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Song, User])],
  controllers: [PlayListController],
  providers: [PlayListService],
})
export class PlayListModule {}
