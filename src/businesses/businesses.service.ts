import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateBusinessDto) {
    return this.prisma.business.create({
      data: {
        ...dto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        managers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        employees: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.business.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { managers: { some: { id: userId } } },
          { employees: { some: { id: userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        managers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        employees: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(userId: string, id: string) {
    const business = await this.prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        managers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        employees: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // Проверяем, имеет ли пользователь доступ к бизнесу
    if (
      business.ownerId !== userId &&
      !business.managers.some(manager => manager.id === userId) &&
      !business.employees.some(employee => employee.id === userId)
    ) {
      throw new ForbiddenException('You do not have access to this business');
    }

    return business;
  }

  async update(userId: string, id: string, dto: UpdateBusinessDto) {
    const business = await this.findOne(userId, id);

    // Только владелец может редактировать бизнес
    if (business.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can update the business');
    }

    return this.prisma.business.update({
      where: { id },
      data: dto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        managers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        employees: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    const business = await this.findOne(userId, id);

    // Только владелец может удалить бизнес
    if (business.ownerId !== userId) {
      throw new ForbiddenException('Only the owner can delete the business');
    }

    return this.prisma.business.delete({
      where: { id },
    });
  }
}
