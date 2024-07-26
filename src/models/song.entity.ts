import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  // Storing array as JSON string
  @Column('text')
  artists: string; // Later parse it as JSON in the application logic

  @Column({ type: 'date' })
  releasedDate: Date;

  // Use string type for time
  @Column({ type: 'time' })
  duration: string;

  @Column({ type: 'text' })
  lyrics: string;
}
