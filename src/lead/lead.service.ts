import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto) {
    const { name, email, phone } = createLeadDto;

    try {
      const dataExist = await this.prisma.lead.findUnique({
        where: {
          email: email,
        },
      });

      if (!dataExist) {
        const lead = await this.prisma.lead.create({
          data: {
            name,
            email,
            phone,
          },
        });

        return lead;
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.CONFLICT,
            Message: 'Usuário já existe',
          },
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
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
      return await this.prisma.lead.findMany({});
    } catch (error) {
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
      return await this.prisma.lead.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
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
      return await this.prisma.lead.update({
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
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao atualizar lead.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.lead.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
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
