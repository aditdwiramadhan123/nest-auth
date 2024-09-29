import { ApiProperty } from '@nestjs/swagger';

export class ReadUserDto {
  @ApiProperty({
    description: 'The unique identifier (ID) of the user.',
    example: 'c56a4180-65aa-42ec-a945-5fd21dec0538',
  })
  id: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The username of the user.',
    example: 'user123',
  })
  username: string;
}
