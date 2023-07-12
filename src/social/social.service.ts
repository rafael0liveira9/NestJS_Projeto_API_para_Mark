import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto, UpdateSocialShowDto } from './dto/update-social.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async updateStatusToShow(createSocialDto: CreateSocialDto) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: createSocialDto.id,
      },
    });

    if (
      socialServiceStatus.socialShowId == null &&
      socialServiceStatus.status == 'CRIACAO'
    ) {
      try {
        const socialServiceStatus = await this.prisma.socialService.update({
          where: {
            id: createSocialDto.id,
          },
          data: {
            status: 'AMOSTRA',
            SocialShow: {
              create: {
                feed: {
                  create: createSocialDto.feed.map((x) => ({
                    text: x.text,
                    type: x.type,
                    imagesId: x.image,
                  })),
                },
              },
            },
          },
          include: {
            SocialShow: {
              include: {
                feed: true,
              },
            },
          },
        });
        return socialServiceStatus;
      } catch (error) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: `Ocorreu um erro na atualização do serviço`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async updateApprove(updateShow: UpdateSocialShowDto) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: updateShow.id,
      },
    });

    if (socialServiceStatus.status == 'CRIACAO') {
      try {
        const socialUpdateSocial = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            status: 'APROVACAO',
            SocialShow: {
              update: {
                allApproved: updateShow.allApproved,
                isRefused: updateShow.isRefused,
                isSendedByClient: false,
                feed: {
                  updateMany: updateShow.feed.map((x) => ({
                    where: {
                      id: x.id,
                    },
                    data: {
                      text: x.text,
                      type: x.type,
                      imagesId: x.image,
                      approved: x.approved,
                      reasonRefuse: x.reasonRefuse,
                    },
                  })),
                },
              },
            },
          },
          include: {
            SocialShow: {
              include: {
                feed: true,
              },
            },
          },
        });

        return socialUpdateSocial;
      } catch (error) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: `Ocorreu um erro na atualização do serviço`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Não é possível fazer isto no momento!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateShow(updateShow: UpdateSocialShowDto, req) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: updateShow.id,
      },
    });

    if (socialServiceStatus.status == 'AMOSTRA') {
      try {
        const socialUpdateService = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            status:
              req.roleType == 3 || req.roleType == 2
                ? 'CRIACAO'
                : updateShow.allApproved
                ? 'CRIACAO'
                : 'AMOSTRA',
            SocialShow: {
              update: {
                allApproved:
                  req.roleType == 3 || req.roleType == 2
                    ? false
                    : updateShow.allApproved,
                isRefused:
                  req.roleType == 3 || req.roleType == 2
                    ? false
                    : updateShow.isRefused,
                feed: {
                  updateMany: updateShow.feed.map((x) => ({
                    where: {
                      id: x.id,
                    },
                    data: {
                      text: x.text,
                      type: x.type,
                      imagesId: x.image,
                      approved:
                        req.roleType == 3 || req.roleType == 2
                          ? false
                          : x.approved,
                      reasonRefuse:
                        req.roleType == 3 || req.roleType == 2
                          ? ''
                          : x.reasonRefuse,
                    },
                  })),
                },
              },
            },
          },
          include: {
            SocialShow: {
              include: {
                feed: true,
              },
            },
          },
        });

        return socialUpdateService;
      } catch (error) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: `Ocorreu um erro na atualização do serviço`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async updateApproveFinal(updateShow: UpdateSocialShowDto, req) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: updateShow.id,
      },
    });

    if (socialServiceStatus.status == 'APROVACAO') {
      try {
        const socialUpdateService = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            SocialShow: {
              update: {
                allApproved:
                  req.roleType == 3 || req.roleType == 2
                    ? false
                    : updateShow.allApproved,
                isRefused:
                  req.roleType == 3 || req.roleType == 2
                    ? false
                    : updateShow.isRefused,
                isSendedByClient:
                  req.roleType == 3 || req.roleType == 2 ? false : true,
                feed: {
                  updateMany: updateShow.feed.map((x) => ({
                    where: {
                      id: x.id,
                    },
                    data: {
                      text: x.text,
                      type: x.type,
                      imagesId: x.image,
                      approved:
                        req.roleType == 3 || req.roleType == 2
                          ? false
                          : x.approved,
                      reasonRefuse:
                        req.roleType == 3 || req.roleType == 2
                          ? ''
                          : x.reasonRefuse,
                    },
                  })),
                },
              },
            },
          },
          include: {
            SocialShow: {
              include: {
                feed: true,
              },
            },
          },
        });

        return socialUpdateService;
      } catch (error) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: `Ocorreu um erro na atualização do serviço`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async findById(id: number) {
    return await this.prisma.socialService.findUnique({
      where: {
        id,
      },
      include: {
        SocialShow: {
          include: {
            feed: {
              include: {
                Images: true,
              },
            },
          },
        },
        SocialBriefing: true,
      },
    });
  }
}
