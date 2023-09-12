import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import {
  CreateBriefingLogoDto,
  CreateBriefingSiteDto,
  CreateBriefingSocialDto,
} from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsanaService } from 'src/singleServices/asana.service';
import { Utils } from 'src/utils/utils';

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

        await this.prisma.$disconnect();

        return serviceBriefing;
      } else {
        await this.prisma.$disconnect();
        throw Error('Nenhum serviço encontrado.');
      }
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum serviço encontrado.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async createSite(createBriefingDto: CreateBriefingSiteDto, @Req() req) {
    try {
      const userData = await this.prisma.client.findUnique({
        where: {
          userId: req.userId,
        },
      });

      const data = await this.prisma.contratedService.findFirst({
        where: {
          companiesId: userData.companiesId,
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
                  url: createBriefingDto.url,
                  urlName: createBriefingDto.urlName,
                  urlLogin: createBriefingDto.urlLogin,
                  urlPass: createBriefingDto.urlPass,
                  host: createBriefingDto.host,
                  hostLogin: createBriefingDto.hostLogin,
                  hostPass: createBriefingDto.hostPass,
                  references: createBriefingDto.references,
                  logo: createBriefingDto.logo,
                  contactData: createBriefingDto.contactData,
                  socialMidia: createBriefingDto.socialMidia,
                  archives: {
                    create: createBriefingDto.archives.map((x) => ({
                      url: x,
                      companiesId: createBriefingDto.companieId,
                    })),
                  },
                  briefing: {
                    create: {
                      url: createBriefingDto.urlBriefing,
                      companiesId: createBriefingDto.companieId,
                    },
                  },
                  colors: createBriefingDto.colors,
                },
                update: {
                  url: createBriefingDto.url,
                  urlName: createBriefingDto.urlName,
                  urlLogin: createBriefingDto.urlLogin,
                  urlPass: createBriefingDto.urlPass,
                  host: createBriefingDto.host,
                  hostLogin: createBriefingDto.hostLogin,
                  hostPass: createBriefingDto.hostPass,
                  references: createBriefingDto.references,
                  logo: createBriefingDto.logo,
                  contactData: createBriefingDto.contactData,
                  socialMidia: createBriefingDto.socialMidia,
                  archives: {
                    create: createBriefingDto.archives.map((x) => ({
                      url: x,
                      companiesId: createBriefingDto.companieId,
                    })),
                  },
                  briefing: {
                    create: {
                      url: createBriefingDto.urlBriefing,
                      companiesId: createBriefingDto.companieId,
                    },
                  },
                  colors: createBriefingDto.colors,
                },
              },
            },
          },
        });

        await this.asana.createTask(
          `Logo / ${data.Companies.companyName}`,
          `
          BRIEFING:
          ${
            createBriefingDto.url != null
              ? `
          Dominio: ${createBriefingDto.url}
          Site do Domínio: ${createBriefingDto.urlName}
          Login do Dominio: ${createBriefingDto.urlLogin}
          Senha do Dominio: ${createBriefingDto.urlPass}
          `
              : 'Sem domínio'
          }
          ${
            createBriefingDto.host != null
              ? `
          Host: ${createBriefingDto.host}
          Login do Host: ${createBriefingDto.hostLogin}
          Senha do Host: ${createBriefingDto.hostPass}
          `
              : 'Sem Hospedagem'
          }
          Modelo do Site: ${createBriefingDto.siteModel},
          URL do Site: ${createBriefingDto.url},
          Referencias: ${createBriefingDto.references},
          Logo: ${createBriefingDto.logo},
          Dados de Contato: ${createBriefingDto.contactData},
          Social Media: ${createBriefingDto.socialMidia},
          Cores do Site: {
            ${createBriefingDto.colors.join(',\n')}
          }
          Arquivos: {
            ${createBriefingDto.archives.join(',\n')}
          },
          Briefing criado pelo usuario: {
            ${createBriefingDto.urlBriefing}
          }
        `,
        );

        await this.prisma.$disconnect();

        return serviceBriefing;
      } else {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum serviço encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      await this.prisma.$disconnect();
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao enviar o briefing',
        },
        HttpStatus.BAD_REQUEST,
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
                daysHours: createBriefingDto.daysHours,
                socialTalk: createBriefingDto.socialTalk,
                socilaProductText: createBriefingDto.socialProductText,
                socialProductImages: {
                  createMany: {
                    data: createBriefingDto.productImages.map((x) => ({
                      url: x.url,
                    })),
                    skipDuplicates: true,
                  },
                },
                socialMediaReference: createBriefingDto.mediaReference,
                mediaType: createBriefingDto.materiaFormat,
                timesPerWeek: {
                  createMany: {
                    data: createBriefingDto.weekDays.map((x) => ({
                      weekDay: x.day,
                    })),
                  },
                },
              },
            },
          },
        });

        const serviceBriefingData = serviceBriefing.createdAt;

        serviceBriefingData.setMonth(
          serviceBriefingData.getMonth() + serviceBriefing.actualMonth,
        );

        await this.asana.createTask(
          `${data.Companies.companyName} / Logo / ${Utils.calendarMonths(
            serviceBriefingData.getMonth(),
          )}/${serviceBriefing.createdAt.getFullYear()}`,
          `
          BRIEFING:

          Horas: ${createBriefingDto.daysHours},
          Quantidade de Material e Dias e Horários: ${createBriefingDto.weekDays.map(
            (x) => 'Dia da Semana: ' + x.day + '\n',
          )}
          O que devemos falar em sua rede social?: ${
            createBriefingDto.socialTalk
          },
          Como você gostaria que fosse o seu material?: ${
            createBriefingDto.materiaFormat
          },
          Imagens do Negócio/Produto/Serviço: ${createBriefingDto.productImages.map(
            (x) => 'URL: ' + x.url + '\n',
          )},
          O que será falado em sua rede social: ${
            createBriefingDto.socialProductText
          },
          Referencias: ${createBriefingDto.mediaReference}
        `,
        );

        await this.prisma.$disconnect();

        return serviceBriefing;
      } else {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum serviço encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      await this.prisma.$disconnect();
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
}
