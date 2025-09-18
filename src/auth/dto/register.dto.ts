import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail(
    {},
    { message: 'Email должен быть корректным адресом электронной почты' },
  )
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль пользователя (минимум 6 символов)',
    minLength: 6,
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Имя пользователя',
  })
  @IsString({ message: 'Имя должно быть строкой' })
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Номер телефона пользователя',
    required: false,
  })
  @IsString({ message: 'Телефон должен быть строкой' })
  @IsOptional()
  phone?: string;
}
