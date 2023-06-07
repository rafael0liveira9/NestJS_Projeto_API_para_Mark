import { Injectable } from '@nestjs/common';
import { CreateBriefingDto } from './dto/create-briefing.dto';
import { UpdateBriefingDto } from './dto/update-briefing.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class BriefingService {
  constructor(private prisma: PrismaService) {}

  create(createBriefingDto: CreateBriefingDto) {
    return '';
  }

  findAll() {
    return `This action returns all briefing`;
  }

  findOne(id: number) {
    const data = this.prisma.companies.findUnique({
      where: {
        id: id,
      },
    });
    return data;
  }

  update(id: number, updateBriefingDto: UpdateBriefingDto) {
    return `This action updates a #${id} briefing`;
  }

  remove(id: number) {
    return `This action removes a #${id} briefing`;
  }
}
