import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  saltOrRounds: number = 10;

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: CreateUserDto) {
    // console.log('-------- registerDto --------');
    // console.log(registerDto);
    // console.log('-----------------------------');

    try {
      registerDto.password = await bcrypt.hash(
        registerDto.password,
        this.saltOrRounds,
      );
    } catch (err) {
      console.log(err);

      return new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const createdUser = await this.userService.create(registerDto);
      const payload = {
        email: createdUser.email,
        password: createdUser.password,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '48h',
      });

      return {
        access_token,
        refresh_token,
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      console.log(err);

      return new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginDto: LoginUserDto) {
    try {
      const user = await this.userService.findOne(loginDto.email);

      if (!user) {
        return new HttpException('Wrong email', HttpStatus.BAD_REQUEST);
      }

      if (!bcrypt.compare(loginDto.password, user.password)) {
        return new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
      }

      const payload = {
        email: user.email,
        password: user.password,
      };

      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      const refresh_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '48h',
      });

      return {
        access_token,
        refresh_token,
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      console.log(err);

      return new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(req: any) {
    // console.log('-------- getProfile --------');
    // console.log(req.user);
    // console.log('----------------------------');
    return req.user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
