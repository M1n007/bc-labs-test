import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../../entities/user.entity';
import { SignInDto } from '../dtos/sign-in.dto';
import { HashService } from 'common/services/hash.service';
import { TransactionManagerService } from 'common/services/transaction-manager.service';
import { JwtService } from '@nestjs/jwt';
import {  SignUpDto } from '../dtos/sign-up.dto'; 

@Injectable()
export class AuthServiceV1 {
  constructor(
    private hashService: HashService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private transactionManagerService: TransactionManagerService,
    private jwtService: JwtService 
  ) {}

  async signInWithEmailAndPassword(payload: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: payload.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verifikasi password
    const isPasswordValid = await this.hashService.comparePassword(
      payload.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.jwtService.sign({ userId: user.id });
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async signUp(createUserDto: SignUpDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { email }
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    return await this.transactionManagerService.execute(async (manager) => {
      const hashedPassword = await this.hashService.hashPassword(password);

      const user = await manager.save(User, {
        email,
        isActive: true,
        password: hashedPassword
      });

      return user;
    });
  }

  refreshToken(user: User, providedRefreshToken: string) {
    try {
      const isValid = this.jwtService.verify(providedRefreshToken);

      if (!isValid || isValid.userId !== user.id) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign({ userId: user.id });
      const refreshToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' }
      );

      return { accessToken, refreshToken };
    } catch (_) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
