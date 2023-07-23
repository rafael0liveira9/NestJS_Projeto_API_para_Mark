import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateLogoDto,
  SendArchivesDto,
  SendFeedbackDto,
} from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class LogoService {
  constructor(private readonly prisma: PrismaService) {}

  async toProof(createLogoDto: CreateLogoDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: createLogoDto.id,
      },
    });

    if (logoService.status != 3) {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço não pode ser atualizado no momento.`,
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      let itemData = await this.prisma.logoService.update({
        where: {
          id: createLogoDto.id,
        },
        data: {
          status: 4,
          LogoProof: {
            create: {
              imagesId: createLogoDto.proof,
              Mockups: {
                create: createLogoDto.mockups.map((x) => ({
                  imagesId: x,
                })),
              },
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return itemData;
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Um erro ocorreu na atualização do serviço. ${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProof(updateLogo: UpdateLogoDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: updateLogo.id,
      },
    });

    const userData = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (logoService.status < 4 || logoService.status > 5) {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço Já atualizado`,
        },
        HttpStatus.CONFLICT,
      );
    }

    let mockups = {},
      imageId = {};

    if (updateLogo.mockupsUp != null) {
      mockups = {
        Mockups: {
          update: updateLogo.mockupsUp.map((x) => ({
            where: {
              id: x.id,
            },
            data: {
              imagesId: x.image,
            },
          })),
        },
      };
    }

    if (userData.roleTypeId > 1) {
      imageId = {
        imagesId: updateLogo.proof,
      };
    }

    try {
      const upLogo = await this.prisma.logoService.update({
        where: {
          id: updateLogo.id,
        },
        data: {
          status: userData.roleTypeId > 1 ? 4 : updateLogo.isApproved ? 6 : 5,
          LogoProof: {
            update: {
              ...imageId,
              reasonRefuse:
                userData.roleTypeId > 1 ? '' : updateLogo.reasonRefuse,
              isApproved:
                userData.roleTypeId > 1 ? false : updateLogo.isApproved,
              userSended: userData.roleTypeId > 1 ? false : true,
              ...mockups,
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return upLogo;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro na atualização do serviço`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendFeedback(sendFeedBack: SendFeedbackDto) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: sendFeedBack.id,
      },
    });

    try {
      const upLogo = await this.prisma.logoService.update({
        where: {
          id: sendFeedBack.id,
        },
        data: {
          feedbackSended: true,
          LogoFeedback: {
            create: {
              comments: sendFeedBack.comments,
              stars: sendFeedBack.stars,
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return upLogo;
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro na atualização do serviço`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addArchives(sendArchive: SendArchivesDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: sendArchive.id,
      },
    });

    if (logoService.status < 7) {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço não pode ser atualizado no momento.`,
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const upLogo = await this.prisma.logoService.update({
        where: {
          id: sendArchive.id,
        },
        data: {
          status: 8,
          LogoArchives: {
            create: sendArchive.archives.map((x) => ({
              name: x.name,
              url: x.url,
              type: x.type,
              previewId: x.previewImage,
            })),
          },
        },
      });

      await this.prisma.$disconnect();

      return upLogo;
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro na atualização do serviço`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async serviceById(id: number) {
    return await this.prisma.logoService.findUnique({
      where: {
        id,
      },
      include: {
        LogoArchives: {
          include: {
            preview: true,
          },
        },
        LogoBriefing: true,
        LogoFeedback: true,
        LogoProof: {
          include: {
            Mockups: {
              include: {
                image: true,
              },
            },
          },
        },
      },
    });
  }
}
