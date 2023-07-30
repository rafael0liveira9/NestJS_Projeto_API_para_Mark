import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    try {
      const data = await this.prisma.images.create({
        data: {
          url: createImageDto.url,
          title: createImageDto.title,
          author: createImageDto.author,
        },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao criar imagem.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.images.findMany({});
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao buscar todas as imagens.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.images.findUnique({
        where: { id },
      });
      await this.prisma.$disconnect();
      return data;
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao buscar imagem.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
