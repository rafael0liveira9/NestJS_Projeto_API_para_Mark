import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    const serviceAdded = await this.prisma.service.create({
      data: {
        serviceTypeId: createServiceDto.serviceTypeId,
        name: createServiceDto.name,
        price: createServiceDto.price,
        description: createServiceDto.description,
        updatedAt: new Date(),
      },
    });

    return serviceAdded;
  }

  async findAll({
    price,
    sort,
    search,
  }: {
    price: number;
    sort: number;
    search: string;
  }) {
    const services = await this.prisma.service.findMany({
      where: {
        name: {
          contains: search || '',
        },
        deletedAt: null,
      },
      orderBy: {
        price: sort == 1 ? 'asc' : sort == 2 ? 'desc' : 'asc',
      },
    });

    return !!price
      ? services.filter((x) => !!price && x.price <= price && x)
      : services;
  }

  async findOne(id: number) {
    return await this.prisma.service.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    return await this.prisma.service.update({
      where: {
        id: id,
      },
      data: {
        serviceTypeId: updateServiceDto.serviceTypeId,
        name: updateServiceDto.name,
        price: updateServiceDto.price,
        description: updateServiceDto.description,
        updatedAt: new Date(),
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.service.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
