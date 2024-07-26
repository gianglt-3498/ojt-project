import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Playlist } from './playlist.entity';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @Column({ type: 'date' })
  releasedDate: Date;

  // Use string type for time
  @Column({ type: 'time' })
  duration: string;

  @Column({ type: 'text' })
  lyrics: string;

  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playList: Playlist;
}
