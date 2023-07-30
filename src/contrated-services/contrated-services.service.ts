import {
  HttpException,
  HttpStatus,
  Injectable,
  Query,
  Req,
} from '@nestjs/common';
import { CreateContratedServiceDto } from './dto/create-contrated-service.dto';
import { UpdateContratedServiceDto } from './dto/update-contrated-service.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ContratedServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(@Req() req, @Query() query) {
    const userData = await this.prisma.client.findUnique({
      where: {
        id: +req.id,
      },
      include: {
        Companie: true,
      },
    });

    if (!userData.Companie) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Sem empresa Cadastrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userData) {
      try {
        const contratedServices = await this.prisma.contratedService.findFirst({
          where: {
            companiesId: userData.Companie.id,
          },
          include: {
            Companies: {
              include: {
                Owner: true,
              },
            },
            LogoContratedItems:
              query.logo == 'true' || query.logo == undefined
                ? {
                    include: {
                      LogoService: {
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
                                include: {
                                  image: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  }
                : false,
            SiteContratedItems:
              query.site == 'true' || query.site == undefined
                ? {
                    include: {
                      SiteService: {
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
                      },
                    },
                  }
                : false,
            SocialContratedItems:
              query.social == 'true' || query.social == undefined
                ? {
                    include: {
                      SocialService: {
                        include: {
                          SocialBriefing: true,
                          SocialShow: {
                            include: {
                              feed: {
                                include: {
                                  Images: true,
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  }
                : false,
          },
        });
        await this.prisma.$disconnect();
        return contratedServices ?? {};
      } catch (error) {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Ocorreu um erro ao buscar serviços',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findAllAdmin() {
    try {
      const data = await this.prisma.contratedService.findMany({
        include: {
          Companies: true,
          LogoContratedItems: {
            include: {
              LogoService: {
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
              },
            },
          },
          SiteContratedItems: {
            include: {
              SiteService: {
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
              },
            },
          },
          SocialContratedItems: {
            include: {
              SocialService: {
                include: {
                  SocialBriefing: true,
                  SocialShow: {
                    include: {
                      feed: {
                        include: {
                          Images: true,
                        },
                      },
                    },
                  },
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
          Message: 'Ocorreu um erro ao buscar serviços',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findById(id: number) {
    try {
      const data = await this.prisma.contratedService.findUnique({
        where: {
          id: id,
        },
        include: {
          Companies: true,
          LogoContratedItems: {
            include: {
              LogoService: {
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
              },
            },
          },
          SiteContratedItems: {
            include: {
              SiteService: {
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
              },
            },
          },
          SocialContratedItems: {
            include: {
              SocialService: {
                include: {
                  SocialBriefing: true,
                  SocialShow: {
                    include: {
                      feed: {
                        include: {
                          Images: true,
                        },
                      },
                    },
                  },
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
          Message: 'Ocorreu um erro ao buscar serviços',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
