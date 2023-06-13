import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateBriefingLogoDto,
  CreateBriefingSiteDto,
  CreateBriefingSocialDto,
} from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class BriefingService {
  constructor(private prisma: PrismaService) {}

  async createLogo(createBriefingDto: CreateBriefingLogoDto) {
    try {
      const data = await this.prisma.contratedService.findFirst({
        where: {
          companiesId: createBriefingDto.companieId,
          AND: [
            {
              LogoContratedItems: {
                some: {
                  id: createBriefingDto.id,
                },
              },
            },
          ],
        },
        include: {
          LogoContratedItems: {
            where: {
              id: createBriefingDto.id,
            },
          },
        },
      });

      if (data?.LogoContratedItems) {
        const serviceBriefing = await this.prisma.logoService.update({
          where: {
            id: createBriefingDto.id,
          },
          data: {
            status: 'CRIACAO',
            LogoBriefing: {
              upsert: {
                create: {
                  format: createBriefingDto.format,
                  cores: createBriefingDto.cores,
                  typography: createBriefingDto.typography,
                  especification: createBriefingDto.especification,
                  description: createBriefingDto.description,
                  references: createBriefingDto.references,
                  mockups: createBriefingDto.mockups,
                },
                update: {
                  format: createBriefingDto.format,
                  cores: createBriefingDto.cores,
                  typography: createBriefingDto.typography,
                  especification: createBriefingDto.especification,
                  description: createBriefingDto.description,
                  references: createBriefingDto.references,
                  mockups: createBriefingDto.mockups,
                },
              },
            },
          },
        });
        return serviceBriefing;
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum serviço encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum serviço encontrado.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async createSite(createBriefingDto: CreateBriefingSiteDto) {
    try {
      const data = await this.prisma.contratedService.findFirst({
        where: {
          companiesId: createBriefingDto.companieId,
          AND: [
            {
              SiteContratedItems: {
                some: {
                  id: createBriefingDto.id,
                },
              },
            },
          ],
        },
        include: {
          SiteContratedItems: {
            where: {
              id: createBriefingDto.id,
            },
          },
        },
      });

      if (data?.SiteContratedItems) {
        const serviceBriefing = await this.prisma.siteService.update({
          where: {
            id: createBriefingDto.id,
          },
          data: {
            status: 'PLANEJAMENTO',
            SiteBriefing: {
              upsert: {
                create: {
                  siteModel: createBriefingDto.siteModel,
                  url: createBriefingDto.url,
                  references: createBriefingDto.references,
                  logo: createBriefingDto.logo,
                  contactData: createBriefingDto.contactData,
                  socialMidia: createBriefingDto.socialMidia,
                },
                update: {
                  siteModel: createBriefingDto.siteModel,
                  url: createBriefingDto.url,
                  references: createBriefingDto.references,
                  logo: createBriefingDto.logo,
                  contactData: createBriefingDto.contactData,
                  socialMidia: createBriefingDto.socialMidia,
                },
              },
            },
          },
        });
        return serviceBriefing;
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum serviço encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum serviço encontrado.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async createSocial(createBriefingDto: CreateBriefingSocialDto) {
    try {
      const data = await this.prisma.contratedService.findFirst({
        where: {
          companiesId: createBriefingDto.companieId,
          AND: [
            {
              SocialContratedItems: {
                some: {
                  id: createBriefingDto.id,
                },
              },
            },
          ],
        },
        include: {
          SocialContratedItems: {
            where: {
              id: createBriefingDto.id,
            },
          },
        },
      });

      if (data?.SocialContratedItems) {
        const serviceBriefing = await this.prisma.socialService.update({
          where: {
            id: createBriefingDto.id,
          },
          data: {
            status: 'PLANEJAMENTO',
            SocialBriefing: {
              upsert: {
                create: {
                  networkType: createBriefingDto.network,
                  serviceType: createBriefingDto.service,
                  imageBase: createBriefingDto.image,
                  materialQuant: createBriefingDto.materiaQuantity,
                  daysHours: createBriefingDto.daysHours,
                  mediaFormat: createBriefingDto.materiaFormat,
                },
                update: {
                  networkType: createBriefingDto.network,
                  serviceType: createBriefingDto.service,
                  imageBase: createBriefingDto.image,
                  materialQuant: createBriefingDto.materiaQuantity,
                  daysHours: createBriefingDto.daysHours,
                  mediaFormat: createBriefingDto.materiaFormat,
                },
              },
            },
          },
        });
        return serviceBriefing;
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum serviço encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum serviço encontrado.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findAll() {
    return `This action returns all briefing`;
  }

  findOne(id: number) {
    return;
  }

  update(id: number, updateBriefingDto: UpdateBriefingDto) {
    return `This action updates a #${id} briefing`;
  }

  remove(id: number) {
    return `This action removes a #${id} briefing`;
  }
}
