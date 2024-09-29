import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import Hasher from 'src/utils/Hasher';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;
    const findUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (findUserByEmail) {
      throw new ConflictException(
        'User with the provided email already exists. Please check the email or use a different one.',
      );
    }

    const findUserByUserName = await this.prisma.user.findUnique({
      where: { username },
    });

    if (findUserByUserName) {
      throw new ConflictException(
        'A user with the provided username already exists. Please check the username or use a different one.',
      );
    }

    const hashedPassword = await Hasher.hashPassword(password);

    try {
      // Save user to the database
      return await this.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, username, password } = loginDto;

    const requestedUser = await this.prisma.user.findUnique({
      where: {
        email,
        username,
      },
    });

    if (!requestedUser) {
      throw new NotFoundException(
        'User not found, please check your email or username.',
      );
    }

    const isPasswordMatch = await Hasher.comparePassword(
      password,
      requestedUser.password,
    );

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password, please try again.');
    }

    delete requestedUser.email;
    delete requestedUser.password;

    try {
      const token = jwt.sign(requestedUser, process.env.SECRET_KEY);

      return { token };
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate token');
    }
  }
}
