import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';
import { Client, Companies, User } from '@prisma/client';

import { v4 as uuidv4 } from 'uuid';
import * as moment from 'moment';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService, private asaas: AsaasService) {}

  private contracts = [3, 6, 12];

  async checkout(createPaymentDto: CreatePaymentDto, @Req() req) {
    let valueTotal = { price: 0, value: 0 };
    valueTotal = await this.calculateValue(createPaymentDto);

    return this.checkoutPayment(createPaymentDto, req, valueTotal);
  }

  private async checkoutPayment(
    createPaymentDto: CreatePaymentDto,
    @Req() req,
    valueTotal: {
      price: number;
      value: number;
    },
  ) {
    if (createPaymentDto.contractTime)
      if (this.contracts.indexOf(createPaymentDto.contractTime) == -1) {
        throw new HttpException(
          {
            Code: HttpStatus.NOT_FOUND,
            Message: 'Selecione um tempo de contrato válido.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
    const clientData = await this.prisma.client.findUnique({
      where: {
        id: req.id,
      },
      include: {
        Companie: true,
        User: true,
      },
    });

    if (clientData.defaulter) {
      throw new HttpException(
        {
          Code: HttpStatus.UNAUTHORIZED,
          Message: 'Usuário Inadimplente',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    let apiMethod = {};

    if (createPaymentDto.paymentMethod.billingType == 'CREDIT_CARD') {
      if (!createPaymentDto.paymentMethod.creditCard) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Necessario enviar dados do cartão de crédito.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      if (
        !createPaymentDto.paymentMethod.creditCard.holderName ||
        !createPaymentDto.paymentMethod.creditCard.number ||
        !createPaymentDto.paymentMethod.creditCard.expiryMonth ||
        !createPaymentDto.paymentMethod.creditCard.expiryYear ||
        !createPaymentDto.paymentMethod.creditCard.ccv
      ) {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Necessario enviar dados do cartão de crédito.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      apiMethod = {
        creditCard: {
          holderName: createPaymentDto.paymentMethod.creditCard.holderName,
          number: createPaymentDto.paymentMethod.creditCard.number,
          expiryMonth: createPaymentDto.paymentMethod.creditCard.expiryMonth,
          expiryYear: createPaymentDto.paymentMethod.creditCard.expiryYear,
          ccv: createPaymentDto.paymentMethod.creditCard.ccv,
        },
      };
    }

    if (clientData.Companie) {
      const uuidPayment = uuidv4();

      try {
        const payment = await this.asaas.createPayment({
          costumer: clientData.costumerId,
          dueDate: moment().add(7, 'd').format('YYYY-MM-DD'),
          value: valueTotal.price,
          description: 'Produto comprado',
          externalReference: `${uuidPayment}`,
          valueInstall: valueTotal.value,
          installments: createPaymentDto.installments,
          contractTime: createPaymentDto.contractTime,
          userInfo: {
            name: clientData.Companie.companyName,
            email: clientData.User.email,
            phoneNumber: clientData.phone,
            addressNumber: clientData.document,
            cep: clientData.cep,
            cpf: clientData.document,
          },
          ...apiMethod,
        });

        await this.prisma.$disconnect();

        return await this.sendPaymentData(
          createPaymentDto,
          clientData,
          valueTotal.price,
          await payment.json(),
          uuidPayment,
          undefined,
          undefined,
          !!createPaymentDto.contractTime,
        );
      } catch (error) {
        console.log(error);
        await this.prisma.$disconnect();
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Não foi possível concluir a compra',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhuma compania encontrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async finishCheckout(uuid: string) {
    const socialServices = [],
      logoServices = [],
      siteServices = [];

    const paymentData = await this.prisma.payments.findUnique({
      where: {
        uuid: uuid,
      },
      include: {
        PaymentsServices: true,
        Client: {
          include: {
            Companie: true,
          },
        },
      },
    });

    const userContratedService = await this.prisma.contratedService.upsert({
      where: {
        companiesId: paymentData.companiesId,
      },
      create: {
        companiesId: paymentData.companiesId,
      },
      update: {
        companiesId: paymentData.companiesId,
      },
    });

    if (paymentData) {
      paymentData.PaymentsServices.map(async (x) => {
        if (x.serviceId != null) {
          const serviceData = await this.prisma.service.findUnique({
            where: {
              id: x.serviceId,
            },
          });

          if (serviceData.serviceTypeId == 1) {
            const contratedService = await this.prisma.contratedService.upsert({
              where: {
                id: userContratedService.id,
              },
              create: {
                companiesId: x.companiesId,
                SiteContratedItems: {
                  create: {
                    SiteService: {
                      create: {
                        serviceTypeId: 1,
                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              update: {
                companiesId: x.companiesId,
                SiteContratedItems: {
                  create: {
                    SiteService: {
                      create: {
                        serviceTypeId: 1,
                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              include: {
                SocialContratedItems: true,
                LogoContratedItems: true,
                SiteContratedItems: true,
              },
            });

            await this.prisma.$disconnect();

            return contratedService;
          } else if (serviceData.serviceTypeId == 2) {
            const contratedService = await this.prisma.contratedService.upsert({
              where: {
                id: userContratedService.id,
              },
              create: {
                companiesId: x.companiesId,
                LogoContratedItems: {
                  create: {
                    LogoService: {
                      create: {
                        serviceTypeId: 2,

                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              update: {
                companiesId: x.companiesId,
                LogoContratedItems: {
                  create: {
                    LogoService: {
                      create: {
                        serviceTypeId: 2,

                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              include: {
                SocialContratedItems: true,
                LogoContratedItems: true,
                SiteContratedItems: true,
              },
            });

            await this.prisma.$disconnect();

            return contratedService;
          } else if (serviceData.serviceTypeId == 3) {
            const contratedService = await this.prisma.contratedService.upsert({
              where: {
                id: userContratedService.id,
              },
              create: {
                companiesId: x.companiesId,
                SocialContratedItems: {
                  create: {
                    SocialService: {
                      create: {
                        serviceTypeId: 3,

                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              update: {
                companiesId: x.companiesId,
                SocialContratedItems: {
                  create: {
                    SocialService: {
                      create: {
                        serviceTypeId: 3,

                        updatedAt: new Date(),
                      },
                    },
                  },
                },
              },
              include: {
                SocialContratedItems: true,
                LogoContratedItems: true,
                SiteContratedItems: true,
              },
            });

            await this.prisma.$disconnect();

            return contratedService;
          }
        } else if (x.packagesId != null) {
          const packageData = await this.prisma.packages.findFirst({
            where: {
              id: x.packagesId,
            },
            include: {
              PackagesServices: {
                include: {
                  Service: true,
                },
              },
            },
          });

          packageData.PackagesServices.forEach((x) => {
            if (x.Service.serviceTypeId == 1) {
              siteServices.push(x.Service.id);
            }
            if (x.Service.serviceTypeId == 2) {
              socialServices.push(x.Service.id);
            }
            if (x.Service.serviceTypeId == 3) {
              logoServices.push(x.Service.id);
            }
          });

          const contratedServices = await this.prisma.contratedService.upsert({
            where: {
              id: userContratedService.id,
            },
            create: {
              companiesId: userContratedService.companiesId,
              SiteContratedItems: {
                create: !!siteServices
                  ? siteServices.map(
                      (
                        x,
                      ): {
                        SiteService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        SiteService: {
                          create: {
                            serviceTypeId: 1,

                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
              SocialContratedItems: {
                create: !!socialServices
                  ? socialServices.map(
                      (
                        x,
                      ): {
                        SocialService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        SocialService: {
                          create: {
                            serviceTypeId: 3,

                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
              LogoContratedItems: {
                create: !!logoServices
                  ? logoServices.map(
                      (
                        x,
                      ): {
                        LogoService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        LogoService: {
                          create: {
                            serviceTypeId: 2,

                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
            },
            update: {
              companiesId: userContratedService.companiesId,
              SiteContratedItems: {
                create: !!siteServices
                  ? siteServices.map(
                      (
                        x,
                      ): {
                        SiteService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        SiteService: {
                          create: {
                            serviceTypeId: 1,
                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
              SocialContratedItems: {
                create: !!socialServices
                  ? socialServices.map(
                      (
                        x,
                      ): {
                        SocialService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        SocialService: {
                          create: {
                            serviceTypeId: 3,
                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
              LogoContratedItems: {
                create: !!logoServices
                  ? logoServices.map(
                      (
                        x,
                      ): {
                        LogoService: {
                          create: {
                            serviceTypeId: number;
                            updatedAt: any;
                          };
                        };
                      } => ({
                        LogoService: {
                          create: {
                            serviceTypeId: 2,
                            updatedAt: new Date(),
                          },
                        },
                      }),
                    )
                  : [],
              },
            },
            include: {
              SocialContratedItems: true,
              LogoContratedItems: true,
              SiteContratedItems: true,
            },
          });

          await this.prisma.$disconnect();

          return contratedServices;
        } else {
          await this.prisma.$disconnect();
          throw new HttpException(
            {
              Code: HttpStatus.BAD_REQUEST,
              Message: 'Ocorreu um erro na criação do serviço',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      });
    } else {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Escolha um pacote ou um serviço',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async webhookPayment(req: any) {
    console.log('-------------------->', req);
    try {
      if (req.payment.status == 'RECEIVED') {
        if (!req.payment.externalReference) return 'OK';
        await this.prisma.payments.update({
          where: {
            uuid: req.payment.externalReference,
          },
          data: {
            status: 'FINISHED_PAYMENT',
          },
        });

        await this.finishCheckout(req.payment.externalReference);
      }
      await this.prisma.$disconnect();
      return 'OK';
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Ocorreu um erro ao enviar o webhook',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async calculateValue(
    createPaymentDto: CreatePaymentDto,
  ): Promise<{ price: number; value: number }> {
    if (createPaymentDto.service != null) {
      if (typeof createPaymentDto.service == 'number') {
        const serviceData = await this.prisma.service.findUnique({
          where: {
            id: createPaymentDto.service,
          },
        });

        if (serviceData == null) {
          throw new HttpException(
            {
              Code: HttpStatus.NOT_FOUND,
              Message: 'Serviço não encontrado',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        await this.prisma.$disconnect();

        return {
          price: serviceData.price,
          value: serviceData.price / createPaymentDto.installments ?? 1,
        };
      } else {
        const servicesLocal = [];
        let total = 0;

        for (let i = 0; i < createPaymentDto.service.length; i++) {
          const serviceData = await this.prisma.service.findFirst({
            where: {
              id: createPaymentDto.service[i],
            },
          });

          if (serviceData == null) {
            throw new HttpException(
              {
                Code: HttpStatus.NOT_FOUND,
                Message: `Serviço ${createPaymentDto.service[i]} não encontrado`,
              },
              HttpStatus.NOT_FOUND,
            );
          }

          servicesLocal.push(serviceData);
        }

        servicesLocal.map((x) => {
          total += x.price;
        });

        await this.prisma.$disconnect();

        return {
          price: total,
          value: total / createPaymentDto.installments ?? 1,
        };
      }
    } else if (createPaymentDto.package != null) {
      const packageData = await this.prisma.packages.findFirst({
        where: {
          id: createPaymentDto.package,
        },
      });

      await this.prisma.$disconnect();

      return {
        price: packageData.price,
        value: packageData.price / createPaymentDto.installments ?? 1,
      };
    } else {
      await this.prisma.$disconnect();
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: `Necessário escolher um serviço ou pacote`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async sendPaymentData(
    createPaymentDto: CreatePaymentDto,
    clientData: Client & {
      Companie: Companies;
      User: User;
    },
    totalVal: number,
    paymentData: any,
    uuid: string,
    discount?: number,
    voucherId?: number,
    isSubscription?: boolean,
  ) {
    console.log(
      createPaymentDto.service
        ? typeof createPaymentDto.service == 'number'
          ? {
              clientId: clientData.id,
              companiesId: clientData.Companie.id,
              serviceId: createPaymentDto.service,
            }
          : createPaymentDto.service.map((x) => ({
              clientId: clientData.id,
              companiesId: clientData.Companie.id,
              serviceId: x,
            }))
        : {
            clientId: clientData.id,
            companiesId: clientData.Companie.id,
            serviceId: createPaymentDto.package,
          },
    );
    const data = await this.prisma.payments.create({
      data: {
        uuid,
        clientId: clientData.id,
        companiesId: clientData.Companie.id,
        value: totalVal,
        discount: discount,
        voucherId,
        status: 'WAITING',
        logGateway: JSON.stringify(paymentData),
        updatedAt: new Date(),
        subscription: isSubscription,
        PaymentsServices: {
          create: createPaymentDto.service
            ? typeof createPaymentDto.service == 'number'
              ? {
                  clientId: clientData.id,
                  companiesId: clientData.Companie.id,
                  serviceId: createPaymentDto.service,
                }
              : createPaymentDto.service.map((x) => ({
                  clientId: clientData.id,
                  companiesId: clientData.Companie.id,
                  serviceId: x,
                }))
            : {
                clientId: clientData.id,
                companiesId: clientData.Companie.id,
                packagesId: createPaymentDto.package,
              },
        },
      },
    });
    await this.prisma.$disconnect();
    return data;
  }

  async findAll() {
    const data = await this.prisma.payments.findMany({
      include: {
        Client: {
          include: {
            User: {
              select: {
                email: true,
                id: true,
                roleTypeId: true,
              },
            },
          },
        },
      },
    });
    await this.prisma.$disconnect();
    return data;
  }

  async findOne(id) {
    const data = await this.prisma.payments.findUnique({
      where: {
        uuid: id,
      },
      include: {
        Client: {
          include: {
            User: true,
          },
        },
        Companies: true,
        PaymentsServices: {
          include: {
            Package: {
              include: {
                PackagesServices: {
                  include: {
                    Service: true,
                  },
                },
              },
            },
            Payment: true,
            Service: true,
          },
        },
      },
    });
    await this.prisma.$disconnect();
    return data;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
