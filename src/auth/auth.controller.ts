import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserRequest } from 'src/user/request/createUser.request';
import { User } from 'src/models/user.entity';
import { LoginRequest } from './request/login.request';
import { ArtistService } from 'src/artist/artist.service';
import { JwtService } from '@nestjs/jwt';
import { JWTAuthGuard } from './jwt-guard';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

type Enable2FAType = {
  secret: string;
};

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

  @Post('enable-2fa')
  @UseGuards(JWTAuthGuard)
  enable2FA(@Request() request): Promise<Enable2FAType> {
    console.log(request.user);
    return this.authService.enable2FA(request.user.userId);
  }

  @Get('disable-2fa')
  @UseGuards(JWTAuthGuard)
  disable2FA(
    @Request()
    req,
  ): Promise<UpdateResult> {
    return this.authService.disable2FA(req.user.userId);
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  getProfile(
    @Request()
    req,
  ) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user,
    };
  }
}
