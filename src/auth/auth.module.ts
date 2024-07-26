import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';
import { JWTAuthGuard } from './jwt-guard';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET_CODE,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    PassportModule,
    ArtistModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy, JWTAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
