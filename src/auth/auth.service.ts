import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../singleServices/prisma.service';
import { ClientJToken, EmployeeJToken, ErrorReturn } from 'src/types/types';

import * as bcrypt from 'bcrypt';
import { JwtService } from '../singleServices/jwt.service';
import {
  CreateUserAdmin,
  CreateUserClient,
  UserDefault,
} from './dto/create-user.dto';
import { LeadService } from 'src/lead/lead.service';
import { AsaasService } from 'src/singleServices/asaas.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private leadService: LeadService,
    private asaas: AsaasService,
  ) {}

  async createUserClient(
    params: CreateUserClient,
  ): Promise<ClientJToken | ErrorReturn> {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          email: params.email,
        },
      });

      if (!userExist) {
        const userLead = this.leadService.subscribe({
          email: params.email,
          phone: '',
          name: '',
        });

        const costumerData = await this.asaas.createCostumer({
          email: params.email,
          phone: params.phone,
          name: params.name,
          document: params.document.replace(/\D/gm, ''),
        });

        if (!!costumerData.errors) throw new Error('Email incorreto');

        const clientData = await this.prisma.client.create({
          data: {
            name: params.name,
            document: params.document,
            documentType: params.documentType,
            phone: params.phone,
            costumerId: costumerData.id,
            cep: params.cep,
            User: {
              create: {
                email: params.email,
                password: await bcrypt.hash(params.password, 8),
                notification: true,
                firebaseToken: params.firebaseToken,
              },
            },
          },
          include: {
            User: {
              select: {
                email: true,
                id: true,
                roleTypeId: true,
                firebaseToken: true,
              },
            },
          },
        });

        await this.prisma.$disconnect();

        return {
          ...clientData,
          jwt: this.jwt.signJwt({
            id: clientData.id,
            userId: clientData.User.id,
            roleType: clientData.User.roleTypeId,
          }),
        };
      } else {
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.CONFLICT,
            Message: 'Usuário já existe, tente outro email',
          },
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
      console.log(error);
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: error.toString(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUserEmployee(
    params: CreateUserAdmin,
  ): Promise<EmployeeJToken | ErrorReturn> {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          email: params.email,
        },
      });

      if (!userExist) {
        const employeeData = await this.prisma.employee.create({
          data: {
            name: params.name,
            document: params.document,
            documentType: params.documentType,
            phone: params.phone,
            updatedAt: new Date(),
            User: {
              create: {
                email: params.email,
                password: await bcrypt.hash(params.password, 8),
                firebaseToken: params.firebaseToken,
                roleTypeId: !params.isAdmin ? 2 : 3,
              },
            },
          },
          include: {
            User: {
              select: {
                email: true,
                id: true,
                roleTypeId: true,
                firebaseToken: true,
              },
            },
          },
        });

        await this.prisma.$disconnect();

        return {
          ...employeeData,
          jwt: this.jwt.signJwt({
            id: employeeData.id,
            userId: employeeData.User.id,
            roleType: employeeData.User.roleTypeId,
          }),
        };
      } else {
        await this.prisma.$disconnect();

        return {
          Message: params.isAdmin
            ? 'Admin Já existe, tente outro email'
            : 'Funcionário já existe, tente outro email',
          Code: 400,
        };
      }
    } catch (error) {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.FORBIDDEN,
          Message: error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async userLogin(
    params: UserDefault,
  ): Promise<EmployeeJToken | ClientJToken | ErrorReturn> {
    console.log(params);
    try {
      const userExist = await this.prisma.client.findFirst({
        where: {
          User: {
            email: params.email,
          },
        },
        include: {
          User: {
            select: {
              email: true,
              firebaseToken: true,
              id: true,
              password: true,
              deletedAt: true,
              roleTypeId: true,
            },
          },
        },
      });

      console.log(userExist);

      if (userExist) {
        if (userExist.User.deletedAt == null) {
          const result = bcrypt.compareSync(
            params.password,
            userExist.User.password,
          );
          if (!result) {
            await this.prisma.$disconnect();
            throw new HttpException(
              {
                Code: HttpStatus.CONFLICT,
                Message: 'Email incorreto ou não encontrado',
              },
              HttpStatus.CONFLICT,
            );
          }
          if (result) {
            const token = this.jwt.signJwt({
              id: userExist.id,
              userId: userExist.User.id,
              roleType: userExist.User.roleTypeId,
            });

            const userExistData = await this.prisma.client.findFirst({
              where: {
                User: {
                  email: params.email,
                },
              },
              include: {
                User: {
                  select: {
                    id: true,
                    email: true,
                    firebaseToken: true,
                    roleTypeId: true,
                  },
                },
              },
            });

            return { ...userExistData, jwt: token };
          }
        } else {
          await this.prisma.$disconnect();
          throw new HttpException(
            {
              Code: HttpStatus.CONFLICT,
              Message: 'Email incorreto ou não encontrado',
            },
            HttpStatus.CONFLICT,
          );
        }
      } else {
        const userSecond = await this.prisma.employee.findFirst({
          where: {
            User: {
              email: params.email,
            },
          },
          include: {
            User: {
              select: {
                email: true,
                firebaseToken: true,
                id: true,
                password: true,
                deletedAt: true,
                roleTypeId: true,
              },
            },
          },
        });

        if (userSecond) {
          if (userSecond.User.deletedAt == null) {
            const result = bcrypt.compareSync(
              params.password,
              userSecond.User.password,
            );
            if (!result) {
              await this.prisma.$disconnect();
              throw new HttpException(
                {
                  Code: HttpStatus.CONFLICT,
                  Message: 'Email incorreto ou não encontrado',
                },
                HttpStatus.CONFLICT,
              );
            }
            if (result) {
              const token = this.jwt.signJwt({
                id: userSecond.id,
                userId: userSecond.User.id,
                roleType: userSecond.User.roleTypeId,
              });

              const userSecondData = await this.prisma.employee.findFirst({
                where: {
                  User: {
                    email: params.email,
                  },
                },
                include: {
                  User: {
                    select: {
                      email: true,
                      firebaseToken: true,
                      id: true,
                      roleTypeId: true,
                    },
                  },
                },
              });
              await this.prisma.$disconnect();
              return {
                ...userSecondData,
                jwt: token,
              };
            }
          } else {
            await this.prisma.$disconnect();
            throw new HttpException(
              {
                Code: HttpStatus.CONFLICT,
                Message: 'Email incorreto ou não encontrado',
              },
              HttpStatus.CONFLICT,
            );
          }
        } else {
          await this.prisma.$disconnect();
          throw new HttpException(
            {
              Code: HttpStatus.CONFLICT,
              Message: 'Email incorreto ou não encontrado',
            },
            HttpStatus.CONFLICT,
          );
        }
      }
    } catch (error) {
      console.log(error);
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: error,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
