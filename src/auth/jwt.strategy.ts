import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface PayloadValidateInterface {
  sub: number;
  email: string;
  artistId: number;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreeignoreExpiration: false, // 2.
      secretOrKey: process.env.SECRET_CODE, // 3x
    });
  }

  async validate(payload: PayloadValidateInterface) {
    return {
      userId: payload.sub,
      email: payload.email,
      artistId: payload.artistId,
    };
  }
}
