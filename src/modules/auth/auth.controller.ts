import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Res() res: Response, @Body() registerDto: RegisterDto) {
    try {
      const user = await this.authService.register(registerDto);
      return res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'User successfully registered',
        data: user,
      });
    } catch (error) {
      if (error.message.includes('email already exists')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (error.message.includes('username already exists')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: error.message,
            error: 'Bad Request',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Res() res: Response, @Body() loginDto: LoginDto) {
    try {
      const tokenData = await this.authService.login(loginDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User successfully logged in',
        data: tokenData,
      });
    } catch (error) {
      if (error.message.includes('User not found')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message,
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error.message.includes('Invalid password')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: error.message,
            error: 'Unauthorized',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred',
          error: 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
