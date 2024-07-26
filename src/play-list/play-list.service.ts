import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/models/playlist.entity';
import { Song } from 'src/models/song.entity';
import { User } from 'src/models/user.entity';
import { In, Repository } from 'typeorm';
import { CreatePlayListRequest } from './request/create-play-list.request';

@Injectable()
export class PlayListService {
  constructor(
    @InjectRepository(Playlist) private playListRepo: Repository<Playlist>,
    @InjectRepository(Song) private songsRepo: Repository<Song>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(playListRequest: CreatePlayListRequest): Promise<Playlist> {
    const playList = new Playlist();

    const { name, songs, user } = playListRequest;

    playList.name = name;
    playList.songs = await this.songsRepo.findBy({ id: In([...songs]) });
    playList.user = await this.userRepo.findOneBy({ id: user });

    return this.playListRepo.save(playList);
  }
}
