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

    if (logoService.status != 'CRIACAO') {
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
          status: 'PROVAS',
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

    console.log(updateLogo);

    if (logoService.status == 'AVALIACAO') {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço Já atualizado`,
        },
        HttpStatus.CONFLICT,
      );
    }

    console.log(logoService);

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

    if (req.roleType == 3 || req.roleType == 2) {
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
          status:
            req.roleType == 3 || req.roleType == 2
              ? 'PROVAS'
              : updateLogo.isApproved
              ? 'AVALIACAO'
              : 'PROVAS',
          LogoProof: {
            update: {
              ...imageId,
              reasonRefuse:
                req.roleType == 3 || req.roleType == 2
                  ? ''
                  : updateLogo.reasonRefuse,
              isApproved:
                req.roleType == 3 || req.roleType == 2
                  ? false
                  : updateLogo.isApproved,
              userSended: req.roleType == 3 || req.roleType == 2 ? false : true,
              ...mockups,
            },
          },
        },
      });

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

    // if (
    //   logoService.status == 'AVALIACAO'
    // ) {
    //   throw new HttpException(
    //     {
    //       Code: HttpStatus.CONFLICT,
    //       Message: `Serviço não pode ser atualizado no momento.`,
    //     },
    //     HttpStatus.CONFLICT,
    //   );
    // }

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

      this.prisma.$disconnect();

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

    if (logoService.status != 'AVALIACAO') {
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
          status: 'CONCLUSAO',
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

      this.prisma.$disconnect();

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
