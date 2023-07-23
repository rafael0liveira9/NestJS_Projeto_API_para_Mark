import { Injectable } from '@nestjs/common';
import { CreatePackageDto, PackagesSearch } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPackageDto: CreatePackageDto) {
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

  async findByValues(packageSearch: PackagesSearch) {
    let data = await this.prisma.packages.findMany({
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

    if (packageSearch.value != null) {
      data = data.filter(
        (x) =>
          x.price <= packageSearch.value + (packageSearch.value / 100) * 10 &&
          x,
      );
    }

    if (
      (packageSearch.haveLogo.isSelected == true &&
        packageSearch.haveLogo.needModification == true) ||
      (packageSearch.haveLogo.isSelected == false &&
        packageSearch.haveLogo.needModification == false)
    ) {
      data = data.filter((x) => {
        if (x.PackagesServices.some((y) => y.Service.serviceTypeId == 3)) {
          return x;
        }
      });
    }
    if (
      (packageSearch.haveSite.isSelected == true &&
        packageSearch.haveSite.needModification == true) ||
      (packageSearch.haveSite.isSelected == false &&
        packageSearch.haveSite.needModification == false)
    ) {
      data = data.filter((x) => {
        if (x.PackagesServices.some((y) => y.Service.serviceTypeId == 1)) {
          return x;
        }
      });
    }

    if (
      (packageSearch.haveSocialMidia.isSelected == true &&
        packageSearch.haveSocialMidia.needModification == true) ||
      (packageSearch.haveSocialMidia.isSelected == false &&
        packageSearch.haveSocialMidia.needModification == false)
    ) {
      data = data.filter((x) => {
        if (x.PackagesServices.some((y) => y.Service.serviceTypeId == 2)) {
          return x;
        }
      });
    }

    return data;
  }

  findOne(id: number) {
    return this.prisma.packages.findUnique({
      where: {
        id: id,
      },
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

  async update(updatePackageDto: UpdatePackageDto) {
    return await this.prisma.packages.update({
      where: {
        id: updatePackageDto.id,
      },
      data: {
        price: updatePackageDto.price,
        name: updatePackageDto.name,
        description: updatePackageDto.description,
        dueDate: updatePackageDto.dueDate
          ? new Date(Date.parse(updatePackageDto.dueDate))
          : null,
        PackagesServices: {
          connectOrCreate: updatePackageDto.servicesUp.map((x) => {
            let idData = {};

            if (x.id) {
              idData = { id: x.id };
            }

            return {
              where: idData,
              create: {
                serviceId: x.service,
              },
            };
          }),
        },
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.packages.update({
      where: {
        id: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
