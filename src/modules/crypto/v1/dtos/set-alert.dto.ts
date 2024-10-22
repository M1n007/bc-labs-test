import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class PriceAlertDto {
  @ApiProperty({ example: 'ETH', description: 'The token name for the price alert' })
  @IsString()
  @IsNotEmpty({ message: 'Token name is required' })
  token_name: string;

  @ApiProperty({ example: 'ethereum', description: 'The chain of the token' })
  @IsString()
  @IsNotEmpty({ message: 'Chain is required' })
  chain: string;

  @ApiProperty({ example: 1000, description: 'Target price for the alert' })
  @IsNumber()
  @Min(0, { message: 'Target price must be greater than or equal to 0' })
  target_price: number;

  @ApiProperty({ example: 'user@example.com', description: 'Email to send the alert to' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
