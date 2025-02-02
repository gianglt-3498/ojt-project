// apiKey.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Thay thế bằng secret key của bạn
    });
  }

  async validate(apiKey: string) {
    const user = await this.authService.validateUserByApiKey(apiKey);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
