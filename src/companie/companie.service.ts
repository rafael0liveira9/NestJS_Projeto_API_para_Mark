import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreateCompanieDto } from './dto/create-companie.dto';
import { UpdateCompanieDto } from './dto/update-companie.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

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
            clientId: req.id,
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

  async findAll() {
    try {
      return await this.prisma.companies.findMany({});
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
