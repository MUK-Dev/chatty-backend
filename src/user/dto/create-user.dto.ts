import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2, { message: 'Name must have atleast 2 characters.' })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3, { message: 'Username must have atleast 3 characters.' })
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty()
  @IsInt()
  age: number;

  @ApiProperty({ enum: ['f', 'm', 'u'] })
  @IsString()
  @IsEnum(['f', 'm', 'u'])
  gender: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password should be atleast 8 characters' })
  @MaxLength(20, { message: 'Password can be max 20 characters' })
  password: string;
}
