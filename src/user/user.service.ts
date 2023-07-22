import { UpdatePasswordDto } from './dto/update-password.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/singleServices/prisma.service';

import * as bcrypt from 'bcrypt';

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

  async updatePassword(updatePasswordDto: UpdatePasswordDto, req) {
    const userdata = await this.prisma.user.findUnique({
      where: {
        id: req.userId,
      },
    });

    if (!updatePasswordDto.oldPassword || !updatePasswordDto.newPassword)
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Digite uma senha para alterar`,
        },
        HttpStatus.BAD_REQUEST,
      );

    if (bcrypt.compare(userdata.password, updatePasswordDto.oldPassword)) {
      await this.prisma.user.update({
        where: {
          id: req.userId,
        },
        data: {
          password: bcrypt.hashSync(updatePasswordDto.newPassword, 8),
        },
      });

      return 'Senha Alterada com Sucesso';
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Usuário não encontrado.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
