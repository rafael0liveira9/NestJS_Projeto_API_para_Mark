import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class ImagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createImageDto: CreateImageDto) {
    return await this.prisma.images.create({
      data: {
        url: createImageDto.url,
        title: createImageDto.title,
        author: createImageDto.author,
      },
    });
  }

  async findAll() {
    return await this.prisma.images.findMany({});
  }

  async findOne(id: number) {
    return await this.prisma.images.findUnique({
      where: { id },
    });
  }
}
