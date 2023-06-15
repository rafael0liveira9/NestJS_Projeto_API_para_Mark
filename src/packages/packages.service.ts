import { Injectable } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto) {
    console.log(createPackageDto);
    try {
      const packageCreate = await this.prisma.packages.create({
        data: {
          name: createPackageDto.name,
          price: createPackageDto.price,
          description: createPackageDto.description,
          dueDate: new Date(Date.parse(createPackageDto.dueDate)),
          PackagesServices: {
            create: createPackageDto.services.map((x) => ({
              serviceId: x,
            })),
          },
        },
      });

      return packageCreate;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findAll() {
    return await this.prisma.packages.findMany({
      include: {
        PackagesServices: {
          include: {
            Service: {
              include: {
                ServiceType: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

  update(id: number, updatePackageDto: UpdatePackageDto) {
    return `This action updates a #${id} package`;
  }

  remove(id: number) {
    return `This action removes a #${id} package`;
  }
}
