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

  async findAllAdmin() {
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
    return data;
  }

  async findById(id: number) {
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
    return data;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} contratedService`;
  // }
}
