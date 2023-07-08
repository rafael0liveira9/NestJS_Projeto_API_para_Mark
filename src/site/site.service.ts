import { Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { SelectLayoutDto } from './dto/select-layout.dto';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  async toLayout(createSiteDto: CreateSiteDto) {
    return await this.prisma.siteService.update({
      where: {
        id: createSiteDto.id,
      },
      data: {
        status: 'DEFINICAO',
        SiteLayoutBase: {
          create: createSiteDto.images.map((x) => ({
            name: x.name,
            layoutId: x.imageId,
          })),
        },
      },
    });
  }

  async toShow(selectLayout: SelectLayoutDto, req) {
    return await this.prisma.siteService.update({
      where: {
        id: selectLayout.id,
      },
      data: {
        status: 'AMOSTRA',
        SiteLayoutSelected: {
          create: {
            layoutId: selectLayout.imageId,
          },
        },
      },
    });
  }

  async saveShow(selectLayout: SelectLayoutDto, req) {
    return await this.prisma.siteService.update({
      where: {
        id: selectLayout.id,
      },
      data: {
        status: 'APRESENTACAO',
      },
    });
  }

  async setLayoutFinished(selectLayout: SelectLayoutDto, req) {
    return await this.prisma.siteService.update({
      where: {
        id: selectLayout.id,
      },
      data: {
        SiteLayoutFinished: {
          create: {
            layoutId: selectLayout.imageId,
          },
        },
      },
    });
  }

  async approveLayout(selectLayout: SelectLayoutDto, req) {
    return await this.prisma.siteService.update({
      where: {
        id: selectLayout.id,
      },
      data: {
        status: selectLayout.isApproved ? 'PUBLICACAO' : 'APRESENTACAO',
        SiteLayoutFinished: {
          update: {
            isApproved: selectLayout.isApproved,
            refuseReason: selectLayout.refuseReason,
            layoutId: selectLayout.imageId,
          },
        },
      },
    });
  }

  async published(selectLayout: SelectLayoutDto, req) {
    return await this.prisma.siteService.update({
      where: {
        id: selectLayout.id,
      },
      data: {
        isPublished: true,
      },
    });
  }
}
