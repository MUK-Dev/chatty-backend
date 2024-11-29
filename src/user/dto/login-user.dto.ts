import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide valid Email.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password should be atleast 8 characters' })
  @MaxLength(20, { message: 'Password can be max 20 characters' })
  password: string;
}
