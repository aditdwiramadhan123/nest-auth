import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email address of the user.',
    example: 'user@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'The username of the user. Must be at least 4 characters long.',
    example: 'user123',
    minLength: 4,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(4, {
    message: 'Username must be at least 4 characters long',
  })
  username: string;

  @ApiProperty({
    description:
      'The password of the user. Must be at least 6 characters long.',
    example: 'securepassword',
    minLength: 6,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;
}
