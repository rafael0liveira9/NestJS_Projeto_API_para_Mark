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

        return companyData;
      } else {
        throw Error('Compania já existe. Tente outra');
      }
    } catch (error) {
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
        userId: req.id,
      },
    });

    if (!userData)
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum dado encontrado',
        },
        HttpStatus.NOT_FOUND,
      );

    if (userData) {
      try {
        const companies = await this.prisma.companies.findMany({
          where: {
            ownerId: userData.id,
          },
        });

        return companies;
      } catch (error) {
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

    if (!userData)
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhum dado encontrado',
        },
        HttpStatus.NOT_FOUND,
      );

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

          return clientData;
        } catch (error) {
          throw new HttpException(
            {
              Code: HttpStatus.BAD_REQUEST,
              Message: 'Não foi possível concluir a mudança',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
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
      return await this.prisma.companies.findMany({
        include: {
          Client: {
            include: {
              User: true,
            },
          },
        },
      });
    } catch (error) {
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
      return await this.prisma.companies.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
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
      return await this.prisma.companies.update({
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
    } catch (error) {
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
      return await this.prisma.companies.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: error?.message ?? error,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
