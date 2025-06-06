import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Название бизнеса' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Описание бизнеса', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Активен ли бизнес', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
