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
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business successfully created' })
  create(
    @Request() req: { user: { id: string } },
    @Body() createBusinessDto: CreateBusinessDto,
  ) {
    return this.businessesService.create(req.user.id, createBusinessDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses for the current user' })
  @ApiResponse({ status: 200, description: 'Return all businesses' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.businessesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a business by id' })
  @ApiResponse({ status: 200, description: 'Return the business' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.businessesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business successfully updated' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  update(
    @Request() req: { user: { id: string } },
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(req.user.id, id, updateBusinessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({ status: 200, description: 'Business successfully deleted' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  remove(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.businessesService.remove(req.user.id, id);
  }
}
