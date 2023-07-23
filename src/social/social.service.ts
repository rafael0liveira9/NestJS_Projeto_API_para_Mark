import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto, UpdateSocialShowDto } from './dto/update-social.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class SocialService {
  constructor(private prisma: PrismaService) {}

  async updateStatusToStatus(
    createSocialDto: CreateSocialDto,
    status: number,
    verifyNumber: number,
  ) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: createSocialDto.id,
      },
    });

    if (socialServiceStatus.status != verifyNumber)
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Serviço já atualizado.`,
        },
        HttpStatus.CONFLICT,
      );

    try {
      const socialService = await this.prisma.socialService.update({
        where: {
          id: createSocialDto.id,
        },
        data: {
          status: status,
        },
      });

      await this.prisma.$disconnect();

      return socialService;
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

  // async updateStatusToCreation(createSocialDto: CreateSocialDto) {
  //   const socialService = await this.prisma.socialService.update({
  //     where: {
  //       id: createSocialDto.id,
  //     },
  //     data: {
  //       status: 7,
  //     },
  //   });

  //   await this.prisma.$disconnect();

  //   return socialService;
  // }

  // async updateStatusToPendingPublish(createSocialDto: CreateSocialDto) {
  //   const socialService = await this.prisma.socialService.update({
  //     where: {
  //       id: createSocialDto.id,
  //     },
  //     data: {
  //       status: 11,
  //     },
  //   });

  //   await this.prisma.$disconnect();

  //   return socialService;
  // }

  // async updateStatusToPublished(createSocialDto: CreateSocialDto) {
  //   const socialService = await this.prisma.socialService.update({
  //     where: {
  //       id: createSocialDto.id,
  //     },
  //     data: {
  //       status: 12,
  //     },
  //   });

  //   await this.prisma.$disconnect();

  //   return socialService;
  // }

  async updateStatusToShow(createSocialDto: CreateSocialDto) {
    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: createSocialDto.id,
      },
    });

    if (
      socialServiceStatus.socialShowId == null &&
      socialServiceStatus.status == 3
    ) {
      try {
        const socialServiceStatus = await this.prisma.socialService.update({
          where: {
            id: createSocialDto.id,
          },
          data: {
            status: 4,
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

    if (socialServiceStatus.status >= 8 && socialServiceStatus.status <= 10) {
      try {
        const socialUpdateSocial = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            status: 9,
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
    const userData = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: updateShow.id,
      },
    });

    if (socialServiceStatus.status >= 4 && socialServiceStatus.status < 7) {
      try {
        const socialUpdateService = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            status:
              userData.roleTypeId > 1 ? 4 : updateShow.allApproved ? 6 : 5,
            SocialShow: {
              update: {
                allApproved:
                  userData.roleTypeId > 1 ? false : updateShow.allApproved,
                isRefused:
                  userData.roleTypeId > 1 ? false : updateShow.isRefused,
                feed: {
                  updateMany: updateShow.feed.map((x) => ({
                    where: {
                      id: x.id,
                    },
                    data: {
                      text: x.text,
                      type: x.type,
                      imagesId: x.image,
                      approved: userData.roleTypeId > 1 ? false : x.approved,
                      reasonRefuse:
                        userData.roleTypeId > 1 ? '' : x.reasonRefuse,
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
    }
  }

  async updateApproveFinal(updateShow: UpdateSocialShowDto, req) {
    const userData = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    const socialServiceStatus = await this.prisma.socialService.findUnique({
      where: {
        id: updateShow.id,
      },
    });

    if (socialServiceStatus.status >= 7 && socialServiceStatus.status < 11) {
      try {
        const socialUpdateService = await this.prisma.socialService.update({
          where: {
            id: updateShow.id,
          },
          data: {
            status:
              socialServiceStatus.status == 7
                ? 8
                : userData.roleTypeId > 1
                ? 8
                : updateShow.allApproved
                ? 10
                : 9,
            SocialShow: {
              update: {
                allApproved:
                  userData.roleTypeId > 1 ? false : updateShow.allApproved,
                isRefused:
                  userData.roleTypeId > 1 ? false : updateShow.isRefused,
                isSendedByClient: userData.roleTypeId > 1 ? false : true,
                feed: {
                  updateMany: updateShow.feed.map((x) => ({
                    where: {
                      id: x.id,
                    },
                    data: {
                      text: x.text,
                      type: x.type,
                      imagesId: x.image,
                      approved: userData.roleTypeId > 1 ? false : x.approved,
                      reasonRefuse:
                        userData.roleTypeId > 1 ? '' : x.reasonRefuse,
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
