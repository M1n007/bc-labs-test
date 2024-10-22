import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSwapRateDto {
  @ApiProperty({
    description: 'The amount of Ethereum to swap',
    example: 1.5,
  })
  @IsNumber()
  @Min(0, { message: 'ETH amount must be greater than or equal to 0' })
  eth_amount: number;
}
