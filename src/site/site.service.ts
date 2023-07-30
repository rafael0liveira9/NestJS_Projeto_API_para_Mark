import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { SelectLayoutDto } from './dto/select-layout.dto';

@Injectable()
export class SiteService {
  constructor(private prisma: PrismaService) {}

  async toLayout(createSiteDto: CreateSiteDto) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: createSiteDto.id,
      },
    });

    if (service.status != 3)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: createSiteDto.id,
        },
        data: {
          status: 4,
          SiteLayoutBase: {
            create: createSiteDto.images.map((x) => ({
              name: x.name,
              layoutId: x.imageId,
            })),
          },
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toPlan(createSiteDto: CreateSiteDto) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: createSiteDto.id,
      },
    });

    if (service.status != 2)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: createSiteDto.id,
        },
        data: {
          status: 3,
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toShow(selectLayout: SelectLayoutDto, req) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: selectLayout.id,
      },
    });

    if (service.status != 4)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: selectLayout.id,
        },
        data: {
          status: 5,
          SiteLayoutSelected: {
            create: {
              layoutId: selectLayout.imageId,
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async saveShow(selectLayout: SelectLayoutDto, req) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: selectLayout.id,
      },
    });

    await this.prisma.$disconnect();

    if (service.status != 5)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: selectLayout.id,
        },
        data: {
          status: 6,
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();

      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async setLayoutFinished(selectLayout: SelectLayoutDto, req) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: selectLayout.id,
      },
    });

    await this.prisma.$disconnect();

    if (service.status > 7 || service.status < 6)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: selectLayout.id,
        },
        data: {
          status: 7,
          SiteLayoutFinished: {
            upsert: {
              create: {
                layoutId: selectLayout.imageId,
                isApproved: undefined,
              },
              update: {
                layoutId: selectLayout.imageId,
                isApproved: undefined,
              },
            },
          },
        },
      });
      await this.prisma.$disconnect();
      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();

      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async approveLayout(selectLayout: SelectLayoutDto, req) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: selectLayout.id,
      },
    });

    if (service.status != 7)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: selectLayout.id,
        },
        data: {
          status: selectLayout.isApproved ? 8 : 7,
          SiteLayoutFinished: {
            update: {
              isApproved: selectLayout.isApproved,
              refuseReason: selectLayout.refuseReason,
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();

      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async published(selectLayout: SelectLayoutDto, req) {
    const service = await this.prisma.siteService.findUnique({
      where: {
        id: selectLayout.id,
      },
    });

    await this.prisma.$disconnect();

    if (service.status != 8)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const serviceData = await this.prisma.siteService.update({
        where: {
          id: selectLayout.id,
        },
        data: {
          status: 9,
          isPublished: true,
        },
      });

      await this.prisma.$disconnect();

      return serviceData;
    } catch (error) {
      await this.prisma.$disconnect();

      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro ao atualizar o serviço.`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: number) {
    const data = await this.prisma.siteService.findUnique({
      where: {
        id,
      },
      include: {
        SiteBriefing: true,
        SiteLayoutBase: {
          include: {
            Layout: true,
          },
        },
        SiteLayoutFinished: {
          include: {
            LayoutFinshed: true,
          },
        },
        SiteLayoutSelected: {
          include: {
            LayoutSelected: true,
          },
        },
      },
    });
    return data;
  }
}
