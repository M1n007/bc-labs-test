// src/modules/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'refresh_token',
  })
  refresh_token: string;
}