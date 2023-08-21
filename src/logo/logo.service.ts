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

  async toPlan(createLogoDto: CreateLogoDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: createLogoDto.id,
      },
    });

    if (logoService.status != 2) {
      await this.prisma.$disconnect();

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
          status: 3,
        },
      });

      await this.prisma.$disconnect();

      return itemData;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Um erro ocorreu na atualização do serviço. ${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toArchives(createLogoDto: CreateLogoDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: createLogoDto.id,
      },
    });

    if (logoService.status != 6) {
      await this.prisma.$disconnect();

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
          status: 7,
        },
      });

      await this.prisma.$disconnect();

      return itemData;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Um erro ocorreu na atualização do serviço. ${error}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toProof(createLogoDto: CreateLogoDto, req) {
    const logoService = await this.prisma.logoService.findUnique({
      where: {
        id: createLogoDto.id,
      },
    });

    if (logoService.status != 3) {
      await this.prisma.$disconnect();

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
      await this.prisma.$disconnect();
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
        id: +updateLogo.id,
      },
      include: {
        LogoProof: {
          include: {
            Mockups: true,
          },
        },
      },
    });

    let mockupDelete = [];

    console.log(updateLogo);

    if (updateLogo.mockupsUp != null) {
      logoService.LogoProof.Mockups.forEach((x) => {
        console.log(x, updateLogo.mockupsUp);
        if (updateLogo.mockupsUp.some((y) => y.id != x.id))
          mockupDelete.push(x.id);
      });
    }

    const userData = await this.prisma.user.findUnique({
      where: {
        id: +req.userId,
      },
    });

    if (logoService.status < 4 || logoService.status > 5) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço Já atualizado`,
        },
        HttpStatus.CONFLICT,
      );
    }

    let mockups = {
        Mockups: {},
      },
      imageId = {};

    if (mockupDelete.length > 0) {
      mockups.Mockups = {
        ...mockups.Mockups,
        update: mockupDelete.map((x) => ({
          where: {
            id: x,
          },
          data: {
            deleteAt: new Date().toISOString(),
          },
        })),
      };
    }

    if (updateLogo.mockupsUp != null) {
      mockups.Mockups = {
        ...mockups.Mockups,
        create: updateLogo.mockupsUp.map((x) => ({
          imagesId: +x.image,
        })),
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
          id: +updateLogo.id,
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
      await this.prisma.$disconnect();
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
      await this.prisma.$disconnect();
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
        id: +sendArchive.id,
      },
    });

    if (logoService.status != 7) {
      await this.prisma.$disconnect();
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
          id: +sendArchive.id,
        },
        data: {
          status: 8,
          LogoArchives: {
            create: sendArchive.archives.map((x) => ({
              name: x.name ?? '',
              url: x.url ?? '',
              type: x.type ?? '',
              preview: {
                connect: {
                  id: +x.previewImage,
                },
              },
            })),
          },
        },
      });

      const companieArchives = await this.prisma.archives.createMany({
        data: sendArchive.archives.map((x) => ({
          companiesId: +sendArchive.companieId,
          url: x.url ?? '',
        })),
      });

      await this.prisma.$disconnect();

      return upLogo;
    } catch (error) {
      console.log(error);
      await this.prisma.$disconnect();
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
    try {
      const data = await this.prisma.logoService.findUnique({
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
              proofImage: true,
              Mockups: {
                where: {
                  deleteAt: null,
                },
                include: {
                  image: true,
                },
              },
            },
          },
        },
      });

      await this.prisma.$disconnect();

      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Ocorreu um erro na busca do serviço`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
