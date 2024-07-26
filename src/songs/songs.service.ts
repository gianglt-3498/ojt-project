import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/models/song.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateSongRequest } from './request/createSong.request';
import { UpdateSongRequest } from './request/updateSong.request';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/models/artist.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song) private songRepository: Repository<Song>,
    @InjectRepository(Artist) private artistRepository: Repository<Artist>,
  ) {}

  async create(songRequest: CreateSongRequest): Promise<Song> {
    const song = new Song();

    song.title = songRequest.title;
    const artist = await this.artistRepository.findBy({
      id: In([...songRequest.artists]),
    });
    song.artists = artist;
    song.duration = songRequest.duration as unknown as string;
    song.lyrics = songRequest.lyrics;
    song.releasedDate = songRequest.releasedDate;

    return await this.songRepository.save(song);
  }
  async findAll(): Promise<Song[]> {
    return await this.songRepository.find({});
  }

  async findOne(id: number): Promise<Song> {
    return await this.songRepository.findOneBy({ id });
  }

  async removeElement(id: number): Promise<void> {
    await this.songRepository.delete(id);
  }

  async updateElement(
    id: number,
    recordToUpdate: UpdateSongRequest,
  ): Promise<UpdateResult> {
    const artists = recordToUpdate.artists
      ? await this.artistRepository.findBy({
          id: In([...recordToUpdate.artists]),
        })
      : [];
    const updateData: Partial<Song> = {
      ...recordToUpdate,
      artists,
      duration: recordToUpdate.duration as unknown as string,
    };
    return this.songRepository.update(id, updateData);
  }

  async findAllWithPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<Song>> {
    const queryBuilder = this.songRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releasedDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }
}
