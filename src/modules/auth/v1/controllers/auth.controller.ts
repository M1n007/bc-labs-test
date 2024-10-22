import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dtos/sign-in.dto';
import { AuthServiceV1 } from '../services/auth.service';
import { User } from 'entities/user.entity';
import { SignUpDto } from '../dtos/sign-up.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { HttpResponse } from 'common/interfaces/http-response.interface';
import { RequestUser } from '../../../../common/decorators/user.decorator';

@ApiTags('Auth v1')
@Controller('auth/v1')
export class AuthControllerV1 {
  constructor(
    private authService: AuthServiceV1,
  ) {}

  @Post('signup')
  async signUp(@Body() body: SignUpDto): Promise<HttpResponse> {
    const user = await this.authService.signUp(body);
    return {
      data: user,
      message: 'User created successfully',
      status_code: HttpStatus.CREATED,
    };
  }

  @Post('signin')
  async signIn(
    @Body() body: SignInDto
  ): Promise<HttpResponse> {
    const { accessToken, refreshToken } = await this.authService.signInWithEmailAndPassword(body);
    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      },
      message: 'Signed in successfully',
      status_code: HttpStatus.OK,
    };
  }

  @Post('refresh-token')
  async refresh(
    @Body() body: RefreshTokenDto,
    @RequestUser() user: User,
  ): Promise<HttpResponse> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(user, body.refresh_token);
    return {
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
      },
      message: 'Token refreshed successfully',
      status_code: HttpStatus.OK,
    };
  }
}
