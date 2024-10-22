import { PickType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";
import { User } from "entities/user.entity";

export class SignUpDto extends PickType(User, ([
  'email'
] as const)) {
  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',
  })
  @IsString({ message: 'Email must be a string' })
  email: string;


  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}