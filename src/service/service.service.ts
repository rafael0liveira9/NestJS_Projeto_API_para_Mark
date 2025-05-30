import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto) {
    console.log(createServiceDto);
    const serviceAdded = await this.prisma.service.create({
      data: {
        name: createServiceDto.name,
        price: createServiceDto.price,
        description: createServiceDto.description,
        updatedAt: new Date(),
        ServiceType: {
          connect: {
            id: createServiceDto.serviceTypeId,
          },
        },
        modelService: {
          connectOrCreate: {
            where: {
              id: createServiceDto.modelId ?? 0,
            },
            create: {
              name: createServiceDto?.model?.name ?? '',
              serviceTypeId: createServiceDto?.serviceTypeId,
            },
          },
        },
      },
    });

    await this.prisma.$disconnect();

    return serviceAdded;
  }

  async getAll() {
    const data = await this.prisma.serviceTypeChoose.findMany({});
    await this.prisma.$disconnect();
    return data;
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

    await this.prisma.$disconnect();

    return !!price
      ? services.filter((x) => !!price && x.price <= price && x)
      : services;
  }

  async findOne(id: number) {
    const data = await this.prisma.service.findUnique({
      where: {
        id: id,
      },
    });
    await this.prisma.$disconnect();
    return data;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    const data = await this.prisma.service.update({
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
    await this.prisma.$disconnect();
    return data;
  }

  async remove(id: number) {
    const data = await this.prisma.service.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    await this.prisma.$disconnect();
    return data;
  }
}
