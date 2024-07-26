import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginRequest } from './request/login.request';
import { User } from 'src/models/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
    const payload = { email, sub };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
