import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    const { name, email, phone } = createLeadDto;

    const dataExist = await this.prisma.lead.findUnique({
      where: {
        email: email,
      },
    });

    if (dataExist) {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: 'Usuário já existe',
        },
        HttpStatus.CONFLICT,
      );
    }

    try {
      const lead = await this.prisma.lead.create({
        data: {
          name,
          email,
          phone,
        },
      });

      await this.prisma.$disconnect();

      return lead;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao criar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.lead.findMany({});
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao buscar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.lead.findUnique({
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
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao buscar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateLeadDto: UpdateLeadDto) {
    try {
      const data = await this.prisma.lead.update({
        where: {
          id,
        },
        data: {
          name: updateLeadDto.name,
          email: updateLeadDto.email,
          phone: updateLeadDto.phone,
          updatedAt: new Date(),
        },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao atualizar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async subscribe(createLeadDto: CreateLeadDto) {
    if (
      await this.prisma.lead.findUnique({
        where: {
          email: createLeadDto.email,
        },
      })
    )
      try {
        const data = await this.prisma.lead.update({
          where: {
            email: createLeadDto.email,
          },
          data: {
            subscribeAt: new Date(),
          },
        });

        await this.prisma.$disconnect();

        return data;
      } catch (error) {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Ocorreu um erro ao atualizar lead.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    else {
      return;
    }
  }

  async remove(id: number) {
    try {
      const data = await this.prisma.lead.delete({
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
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao deletar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
