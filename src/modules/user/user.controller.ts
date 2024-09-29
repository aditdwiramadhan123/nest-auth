import {
  Controller,
  Get,
  Patch,
  Res,
  Body,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiHeader({
  name: 'x-access-token',
  description:
    'Bearer access token used for authentication. Include "Bearer " prefix followed by the token.',
  required: true,
})
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Create a new user
  @Get('all')
  async create(@Res() res: Response) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'Users not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Get the current user information
  @Get('me')
  async findOne(@Res() res: Response) {
    try {
      const userId = res.locals.user.id;
      console.log('hdhdhdh', userId);
      const user = await this.userService.findOne(userId);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message || 'User not found',
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Update the current user information
  @Patch('update')
  async update(@Res() res: Response, @Body() updateUserDto: UpdateUserDto) {
    try {
      const userId = res.locals.user.id;
      const updatedUser = await this.userService.update(userId, updateUserDto);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: error.message || 'User not found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
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
