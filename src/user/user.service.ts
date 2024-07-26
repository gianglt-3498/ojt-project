import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.entity';
import { Repository } from 'typeorm';
import { CreateUserRequest } from './request/createUser.request';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserRequest: CreateUserRequest): Promise<User> {
    const salt = await bcrypt.genSalt();
    createUserRequest.password = await bcrypt.hash(
      createUserRequest.password,
      salt,
    );
    const user = await this.userRepository.save(createUserRequest);
    delete user.password;
    return user;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });

    if (!user) throw new UnauthorizedException('Could not find user');

    return user;
  }
}
