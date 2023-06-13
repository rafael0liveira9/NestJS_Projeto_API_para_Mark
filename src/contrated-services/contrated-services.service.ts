import { Injectable } from '@nestjs/common';
import { CreateContratedServiceDto } from './dto/create-contrated-service.dto';
import { UpdateContratedServiceDto } from './dto/update-contrated-service.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ContratedServicesService {
  constructor(private prisma: PrismaService) {}

  async create(createContratedServiceDto: CreateContratedServiceDto) {
    return 'This action adds a new contratedService';
  }

  async findAll() {
    return await this.prisma.contratedService.findFirst({
      where: {
        companiesId: 1,
      },
      include: {
        SiteContratedItems: {
          include: {
            SiteService: {
              include: {
                SiteBriefing: true,
              },
            },
          },
        },
        SocialContratedItems: {
          include: {
            SocialService: {
              include: {
                SocialBriefing: true,
              },
            },
          },
        },
        LogoContratedItems: {
          include: {
            LogoService: {
              include: {
                LogoBriefing: true,
              },
            },
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} contratedService`;
  }

  update(id: number, updateContratedServiceDto: UpdateContratedServiceDto) {
    return `This action updates a #${id} contratedService`;
  }

  remove(id: number) {
    return `This action removes a #${id} contratedService`;
  }
}
