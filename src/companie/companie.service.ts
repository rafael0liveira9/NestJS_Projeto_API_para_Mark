import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateCompanieDto } from './dto/create-companie.dto';
import { UpdateCompanieDto } from './dto/update-companie.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { ChangeCompanieDto } from './dto/change-companie.dto';

@Injectable()
export class CompanieService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanieDto: CreateCompanieDto, @Req() req) {
    try {
      const existCompanie = await this.prisma.companies.findFirst({
        where: {
          document: createCompanieDto.document,
        },
      });

      if (!existCompanie) {
        const companyData = await this.prisma.companies.create({
          data: {
            document: createCompanieDto.document,
            companyName: createCompanieDto.companyName,
            documentType: createCompanieDto.documentType,
            updatedAt: new Date(),
            Client: {
              connect: {
                id: req.id,
              },
            },
            Owner: {
              connect: {
                id: req.id,
              },
            },
          },
          include: {
            ContratedService: {
              include: {
                LogoContratedItems: true,
                SiteContratedItems: true,
                SocialContratedItems: true,
              },
            },
          },
        });
        await this.prisma.$disconnect();

        return companyData;
      } else {
        await this.prisma.$disconnect();
        throw Error('Compania já existe. Tente outra');
      }
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.FORBIDDEN,
          Message: error?.message ?? error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findMy(@Req() req) {
    const userData = await this.prisma.client.findUnique({
      where: {
        id: req.id,
      },
    });

    if (!userData) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum dado encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userData) {
      try {
        const companies = await this.prisma.companies.findMany({
          where: {
            ownerId: userData.id,
          },
        });
        await this.prisma.$disconnect();

        return companies;
      } catch (error) {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Nenhum dado encontrado',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async activeCompany(changeCompanie: ChangeCompanieDto, @Req() req) {
    const userData = await this.prisma.client.findUnique({
      where: {
        userId: req.id,
      },
    });

    const companieData = await this.prisma.companies.findFirst({
      where: {
        id: changeCompanie.companieId,
        ownerId: userData.id,
      },
    });

    if (!userData) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum dado encontrado',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (userData) {
      if (companieData) {
        try {
          const clientData = await this.prisma.client.update({
            where: {
              id: userData.id,
            },
            data: {
              companiesId: changeCompanie.companieId,
            },
          });

          await this.prisma.$disconnect();

          return clientData;
        } catch (error) {
          await this.prisma.$disconnect();
          throw new HttpException(
            {
              Code: HttpStatus.BAD_REQUEST,
              Message: 'Não foi possível concluir a mudança',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Empresa não cadastrada',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.companies.findMany({
        include: {
          Client: {
            include: {
              User: true,
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
          Code: HttpStatus.FORBIDDEN,
          Message: error?.message ?? error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.companies.findUnique({
        where: {
          id: id,
        },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: error?.message ?? error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOneByDoc(document: string) {
    try {
      const data = await this.prisma.companies.findUnique({
        where: {
          document: document,
        },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: error?.message ?? error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(id: number, updateCompanieDto: UpdateCompanieDto) {
    try {
      const data = await this.prisma.companies.update({
        where: {
          id: id,
        },
        data: {
          document: updateCompanieDto.document,
          documentType: updateCompanieDto.documentType,
          companyName: updateCompanieDto.companyName,
        },
        include: {
          ContratedService: {
            include: {
              LogoContratedItems: true,
              SiteContratedItems: true,
              SocialContratedItems: true,
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
          Code: HttpStatus.NOT_FOUND,
          Message: error?.message ?? error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.companies.delete({
        where: {
          id: id,
        },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: error?.message ?? error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async getArchives(@Req() req) {
    const clientData = await this.prisma.client.findFirst({
      where: {
        userId: req.userId,
      },
      include: {
        Companie: true,
      },
    });

    if (!clientData)
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Usuário não encontrado',
        },
        HttpStatus.NOT_FOUND,
      );

    const itens = await this.prisma.archives.findMany({
      where: {
        companiesId: clientData.Companie.id,
      },
    });

    return itens;
  }
}
