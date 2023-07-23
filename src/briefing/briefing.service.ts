import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateBriefingLogoDto,
  CreateBriefingSiteDto,
  CreateBriefingSocialDto,
} from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsanaService } from 'src/singleServices/asana.service';

@Injectable()
export class BriefingService {
  constructor(private prisma: PrismaService, private asana: AsanaService) {}

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
          Companies: true,
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
            status: 2,
            LogoBriefing: {
              upsert: {
                create: {
                  format: createBriefingDto.format,
                  cores: createBriefingDto.cores,
                  typography: createBriefingDto.typography,
                  especification: createBriefingDto.especification,
                  description: createBriefingDto.description,
                  references: createBriefingDto.references,
                  titlefirst: createBriefingDto.title,
                  titlesecond: createBriefingDto.subtitle,
                },
                update: {
                  format: createBriefingDto.format,
                  cores: createBriefingDto.cores,
                  typography: createBriefingDto.typography,
                  especification: createBriefingDto.especification,
                  description: createBriefingDto.description,
                  references: createBriefingDto.references,
                  titlefirst: createBriefingDto.title,
                  titlesecond: createBriefingDto.subtitle,
                },
              },
            },
          },
        });

        await this.asana.createTask(
          `Logo / ${data.Companies.companyName}`,
          `
          BRIEFING:
          Título Principal: ${createBriefingDto.title},
          Título Secundário: ${createBriefingDto.subtitle},
          Formato: ${createBriefingDto.format},
          Cores: ${createBriefingDto.cores},
          Tipografia: ${createBriefingDto.typography},
          Especificação: ${createBriefingDto.especification},
          Descrição: ${createBriefingDto.description},
          Referencias: ${createBriefingDto.references},
        `,
        );

        return serviceBriefing;
      } else {
        throw Error('Nenhum serviço encontrado.');
      }
    } catch (error) {
      console.log(error?.response.data);
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
          Companies: true,
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
            status: 2,
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

        await this.asana.createTask(
          `Logo / ${data.Companies.companyName}`,
          `
          BRIEFING:

          Modelo do Site: ${createBriefingDto.siteModel},
          URL do Site: ${createBriefingDto.url},
          Referencias: ${createBriefingDto.references},
          Logo: ${createBriefingDto.logo},
          Dados de Contato: ${createBriefingDto.contactData},
          Social Media: ${createBriefingDto.socialMidia},
        `,
        );

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
      console.log(error);
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
          Companies: true,
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
            status: 2,
            SocialBriefing: {
              create: {
                networkType: createBriefingDto.network,
                serviceType: createBriefingDto.service,
                imageBase: createBriefingDto.image,
                materialQuant: createBriefingDto.materiaQuantity,
                daysHours: createBriefingDto.daysHours,
                mediaFormat: createBriefingDto.materiaFormat,
              },
            },
          },
        });

        await this.asana.createTask(
          `Logo / ${data.Companies.companyName}`,
          `
          BRIEFING:

          Tipo de Network: ${createBriefingDto.network},
          Tipo do Serviço: ${createBriefingDto.service},
          Base das Imagens: ${createBriefingDto.image},
          Quantidade de Material: ${createBriefingDto.materiaQuantity},
          Horas e Dias: ${createBriefingDto.daysHours},
          Formato da Media: ${createBriefingDto.materiaFormat},
        `,
        );

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
      console.log(error);
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
