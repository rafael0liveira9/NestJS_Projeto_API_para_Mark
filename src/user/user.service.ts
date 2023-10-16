/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
    const data = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });
    await this.prisma.$disconnect();
    return data;
  }

  async findOne(email: string) {
    const userData = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    await this.prisma.$disconnect();

    if (!userData)
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Usuário não encontrado`,
        },
        HttpStatus.BAD_REQUEST,
      );

    return userData;
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

      await this.prisma.$disconnect();

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

        await this.prisma.$disconnect();

        return userData;
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async updatePassword(updatePasswordDto: UpdatePasswordDto) {
    const userdata = await this.prisma.user.findUnique({
      where: {
        email: updatePasswordDto.email,
      },
    });

    await this.prisma.$disconnect();

    if (!userdata)
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Usuário não encontrado`,
        },
        HttpStatus.BAD_REQUEST,
      );

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
          email: updatePasswordDto.email,
        },
        data: {
          password: bcrypt.hashSync(updatePasswordDto.newPassword, 8),
        },
      });

      await this.prisma.$disconnect();

      return 'Senha Alterada com Sucesso';
    } else {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.CONFLICT,
          Message: `Usuário não encontrado.`,
        },
        HttpStatus.CONFLICT,
      );
    }
  }

  async findByData({ email, document }: { email: string; document: string }) {
    const findedUser = await this.prisma.client.findFirst({
      where: {
        OR: [
          {
            User: {
              email: email,
            },
          },
          {
            document: document,
          },
        ],
      },
    });

    await this.prisma.$disconnect();

    return !!findedUser;
  }

  async arrears(id: number) {
    const userData = await this.prisma.client.findUnique({
      where: {
        id,
      },
    });

    try {
      const user = await this.prisma.client.update({
        where: { id: id },
        data: {
          defaulter: !userData.defaulter ?? false,
        },
      });

      return;
    } catch (error) {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Usuário não encontrado`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
