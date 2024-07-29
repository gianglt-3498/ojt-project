import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequest } from './request/login.request';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistService } from 'src/artist/artist.service';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/models/user.entity';

interface LoginPayloadInterface {
  email: string;
  sub: number;
  artistId?: number;
}

type Enable2FAType = {
  secret: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly artistService: ArtistService,
  ) {}

  async login(loginRequest: LoginRequest): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginRequest);

    const isMatchPassword = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isMatchPassword)
      throw new UnauthorizedException('Password does not match');

    const { email, id: sub } = user;
    const payload: LoginPayloadInterface = { email, sub };

    const artist = await this.artistService.findArtist(sub);

    if (artist) payload.artistId = artist.id;

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.userService.findOne({ id: userId });

    if (!user) throw new UnauthorizedException();

    if (user.enable2FA) return { secret: user.twoFASecret };

    const secret = speakeasy.generateSecret();
    console.log(secret);
    user.twoFASecret = secret.base32;

    await this.userService.updateSecrete(user.id, user.twoFASecret);

    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.userService.findByApiKey(apiKey);
  }
}
