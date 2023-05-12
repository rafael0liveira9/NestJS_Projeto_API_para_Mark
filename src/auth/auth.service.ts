import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Client, Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/singleServices/prisma.service';
import { ClientJToken, EmployeeJToken, ErrorReturn } from 'src/types/types';

import * as bcrypt from 'bcrypt';
import { JwtService } from 'src/singleServices/jwt.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getUsers(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }

  async createUserClient(params: {
    name: string;
    document: string;
    documentType: string;
    password: string;
    phone: string;
    email: string;
    firebaseToken: string;
  }): Promise<ClientJToken | ErrorReturn> {
    try {
      const userExist = await this.prisma.user.findFirst({
        where: {
          email: params.email,
        },
      });

      if (!userExist) {
        const clientData = await this.prisma.client.create({
          data: {
            name: params.name,
            document: params.document,
            documentType: params.documentType,
            phone: params.phone,
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

        return {
          ...clientData,
          jwt: this.jwt.signJwt({
            id: clientData.id,
            userId: clientData.User.id,
            roleType: clientData.User.roleTypeId,
          }),
        };
      } else {
        return { Message: 'Usuário já existe, tente outro email', Code: 400 };
      }
    } catch (error) {
      return { Message: error.toString(), Code: 500 };
    }
  }

  async createUserEmployee(
    params: {
      name: string;
      document: string;
      documentType: string;
      password: string;
      phone: string;
      email: string;
      firebaseToken?: string;
    },
    isAdmin: boolean,
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
                roleTypeId: !isAdmin ? 2 : 1,
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

        return {
          ...employeeData,
          jwt: this.jwt.signJwt({
            id: employeeData.id,
            userId: employeeData.User.id,
            roleType: employeeData.User.roleTypeId,
          }),
        };
      } else {
        return {
          Message: 'Funcionário já existe, tente outro email',
          Code: 400,
        };
      }
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: error,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async userLogin(params: {
    email: string;
    password: string;
  }): Promise<EmployeeJToken | ClientJToken | ErrorReturn> {
    try {
      let userExist = await this.prisma.client.findFirst({
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

      if (userExist) {
        if (userExist.User.deletedAt == null) {
          const result = bcrypt.compareSync(
            params.password,
            userExist.User.password,
          );
          if (!result) {
            return {
              Message: 'Senha incorreta!',
              Code: HttpStatus.FORBIDDEN,
            };
          }
          if (result) {
            var token = this.jwt.signJwt({
              id: userExist.id,
              userId: userExist.User.id,
              roleType: userExist.User.roleTypeId,
            });

            let userExistData = await this.prisma.client.findFirst({
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
          return {
            Message: 'Usuário não existe, tente outro email',
            Code: HttpStatus.NOT_FOUND,
          };
        }
      } else {
        let userSecond = await this.prisma.employee.findFirst({
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
              return {
                Message: 'Senha incorreta!',
                Code: HttpStatus.FORBIDDEN,
              };
            }
            if (result) {
              var token = this.jwt.signJwt({
                id: userSecond.id,
                userId: userSecond.User.id,
                roleType: userSecond.User.roleTypeId,
              });

              let userSecondData = await this.prisma.employee.findFirst({
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
              return {
                ...userSecondData,
                jwt: token,
              };
            }
          } else {
            return {
              Message: 'Usuário não existe!',
              Code: HttpStatus.NOT_FOUND,
            };
          }
        } else {
          return {
            Message: 'Email incorreto ou não encontrado',
            Code: HttpStatus.FORBIDDEN,
          };
        }
      }
    } catch (error) {
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
