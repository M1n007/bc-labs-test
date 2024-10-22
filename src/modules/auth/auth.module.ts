import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthServiceV1 } from './v1/services/auth.service';
import { AuthControllerV1 } from './v1/controllers/auth.controller';
import { User } from 'entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthServiceV1],
  controllers: [AuthControllerV1]
})
export class AuthModule { }
