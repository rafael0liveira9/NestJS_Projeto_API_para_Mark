import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.prisma.user.findMany({});
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findMe(req) {
    try {
      const userData = await this.prisma.client.findFirst({
        where: {
          id: +req.id,
          User: {
            id: +req.userId,
          },
        },
        include: {
          User: true,
        },
      });

      if (userData) {
        return userData;
      } else {
        const userData = await this.prisma.employee.findFirst({
          where: {
            id: +req.id,
            User: {
              id: +req.userId,
            },
          },
          include: {
            User: true,
          },
        });

        return userData;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
