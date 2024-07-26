import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Song } from './models/song.entity';
import { Artist } from './models/artist.entity';
import { User } from './models/user.entity';
import { Playlist } from './models/playlist.entity';
import { PlayListModule } from './play-list/play-list.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'ojt_training',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Adjust path as needed
      synchronize: process.env.TYPEORM_SYNC === 'true', // Use env to toggle sync
    }),
    TypeOrmModule.forFeature([Song, Artist, User, Playlist]),
    SongsModule,
    PlayListModule,
    AuthModule,
    UserModule,
    ArtistModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController);
  }
}
