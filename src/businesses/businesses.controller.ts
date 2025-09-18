import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('businesses')
@Controller('businesses')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создание нового бизнеса' })
  @ApiResponse({ status: 201, description: 'Бизнес успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    return this.businessesService.create(req.user.id, createBusinessDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение всех бизнесов текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Возвращает все бизнесы' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.businessesService.findAll(req.user.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получение бизнеса по ID' })
  @ApiResponse({ status: 200, description: 'Возвращает бизнес' })
  @ApiResponse({ status: 404, description: 'Бизнес не найден' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.businessesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление бизнеса' })
  @ApiResponse({ status: 200, description: 'Бизнес успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Бизнес не найден' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(req.user.id, id, updateBusinessDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удаление бизнеса' })
  @ApiResponse({ status: 200, description: 'Бизнес успешно удален' })
  @ApiResponse({ status: 404, description: 'Бизнес не найден' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  remove(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.businessesService.remove(req.user.id, id);
  }
}
