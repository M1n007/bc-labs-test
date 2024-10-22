// src/modules/users/dto/create-user.dto.ts
import { PickType } from '@nestjs/mapped-types';
import { User } from '../../../../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from '@nestjs/class-validator';

export class SignInDto extends PickType(User, (['email'] as const)) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsString({ message: 'email must be a string' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}