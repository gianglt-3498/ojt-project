import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserRequest } from 'src/user/request/createUser.request';
import { User } from 'src/models/user.entity';
import { LoginRequest } from './request/login.request';
import { ArtistService } from 'src/artist/artist.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly artistService: ArtistService,
    private readonly jswService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserRequest: CreateUserRequest): Promise<User> {
    try {
      return this.userService.create(createUserRequest);
    } catch (error) {
      throw new HttpException('[Error]:', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      });
    }
  }

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return await this.authService.login(loginRequest);
  }
}
