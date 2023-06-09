import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PrismaService } from 'src/singleServices/prisma.service';
import { AsaasService } from 'src/singleServices/asaas.service';
import { Client, Companies, User } from '@prisma/client';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService, private asaas: AsaasService) {}

  //! Fluxo inteiro criado com intuíto de teste, necessário mudar para funcionar junto do Webhook

  async checkout(createPaymentDto: CreatePaymentDto, @Req() req) {
    let valueTotal = await this.calculateValue(createPaymentDto);
    return this.checkoutPayment(createPaymentDto, req, valueTotal);
  }

  private async checkoutPayment(
    createPaymentDto: CreatePaymentDto,
    @Req() req,
    valueTotal: number,
  ) {
    const clientData = await this.prisma.client.findUnique({
      where: {
        id: req.id,
      },
      include: {
        Companies: true,
        User: true,
      },
    });

    if (clientData.Companies.length > 0) {
      try {
        const payment = await this.asaas.createPaymentCreditCard({
          costumer: clientData.costumerId,
          dueDate: '2023-10-05',
          value: valueTotal,
          description: 'Produto comprado',
          externalReference: `${clientData.Companies[0].id}`,
          creditCard: {
            holderName: createPaymentDto.paymentMethod.creditCard.holderName,
            number: createPaymentDto.paymentMethod.creditCard.number,
            expiryMonth: createPaymentDto.paymentMethod.creditCard.expiryMonth,
            expiryYear: createPaymentDto.paymentMethod.creditCard.expiryYear,
            ccv: createPaymentDto.paymentMethod.creditCard.ccv,
          },
          userInfo: {
            name: clientData.Companies[0].companyName,
            email: clientData.User.email,
            phoneNumber: clientData.phone,
            addressNumber: clientData.document,
            cep: clientData.cep,
            cpf: clientData.document,
          },
        });

        await this.sendPaymentData(
          createPaymentDto,
          clientData,
          valueTotal,
          await payment.json(),
        );

        return await this.finishCheckoutWebhook(
          createPaymentDto,
          clientData.Companies[0].id,
        );
      } catch (error) {
        console.log(error);
        return error;
      }
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.NOT_FOUND,
          Message: 'Nenhuma compania encontrada',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async finishCheckoutWebhook(
    createPaymentDto: CreatePaymentDto,
    companieId: number,
  ) {
    let socialServices = [],
      logoServices = [],
      siteServices = [];

    if (createPaymentDto.package == null && createPaymentDto.service != null) {
      if (typeof createPaymentDto.service == 'number') {
        const serviceData = await this.prisma.service.findUnique({
          where: {
            id: createPaymentDto.service,
          },
        });

        if (serviceData.serviceTypeId == 1) {
          const contratedService = await this.prisma.contratedService.upsert({
            where: {
              id: createPaymentDto.contratedServiceId,
            },
            create: {
              companiesId: companieId,
              SiteContratedItems: {
                create: {
                  SiteService: {
                    create: {
                      serviceTypeId: 1,
                      status: 'BRIEFING',
                      updatedAt: new Date(),
                    },
                  },
                },
              },
            },
            update: {
              companiesId: companieId,
              SiteContratedItems: {
                create: {
                  SiteService: {
                    create: {
                      serviceTypeId: 1,
                      status: 'BRIEFING',
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

          return contratedService;
        } else if (serviceData.serviceTypeId == 2) {
          const contratedService = await this.prisma.contratedService.upsert({
            where: {
              id: createPaymentDto.contratedServiceId,
            },
            create: {
              companiesId: companieId,
              LogoContratedItems: {
                create: {
                  LogoService: {
                    create: {
                      serviceTypeId: 2,
                      status: 'BRIEFING',
                      updatedAt: new Date(),
                    },
                  },
                },
              },
            },
            update: {
              companiesId: companieId,
              LogoContratedItems: {
                create: {
                  LogoService: {
                    create: {
                      serviceTypeId: 2,
                      status: 'BRIEFING',
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

          return contratedService;
        } else if (serviceData.serviceTypeId == 3) {
          const contratedService = await this.prisma.contratedService.upsert({
            where: {
              id: createPaymentDto.contratedServiceId,
            },
            create: {
              companiesId: companieId,
              SocialContratedItems: {
                create: {
                  SocialService: {
                    create: {
                      serviceTypeId: 3,
                      status: 'BRIEFING',
                      updatedAt: new Date(),
                    },
                  },
                },
              },
            },
            update: {
              companiesId: companieId,
              SocialContratedItems: {
                create: {
                  SocialService: {
                    create: {
                      serviceTypeId: 3,
                      status: 'BRIEFING',
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

          return contratedService;
        }
      } else {
        throw new HttpException(
          {
            Code: HttpStatus.BAD_REQUEST,
            Message: 'Ocorreu um erro na criação do serviço',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (
      createPaymentDto.package != null &&
      createPaymentDto.service == null
    ) {
      const packageData = await this.prisma.packages.findFirst({
        where: {
          id: createPaymentDto.package,
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

      const contratedServices = await this.prisma.contratedService.create({
        data: {
          companiesId: companieId,
          SiteContratedItems: {
            create: !!siteServices
              ? siteServices.map(
                  (
                    x,
                  ): {
                    SiteService: {
                      create: {
                        serviceTypeId: number;
                        status: 'BRIEFING';
                        updatedAt: any;
                      };
                    };
                  } => ({
                    SiteService: {
                      create: {
                        serviceTypeId: 1,
                        status: 'BRIEFING',
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
                        status: 'BRIEFING';
                        updatedAt: any;
                      };
                    };
                  } => ({
                    SocialService: {
                      create: {
                        serviceTypeId: 3,
                        status: 'BRIEFING',
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
                        status: 'BRIEFING';
                        updatedAt: any;
                      };
                    };
                  } => ({
                    LogoService: {
                      create: {
                        serviceTypeId: 2,
                        status: 'BRIEFING',
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

      return contratedServices;
    } else {
      throw new HttpException(
        {
          Code: HttpStatus.BAD_REQUEST,
          Message: 'Escolha um pacote ou um serviço',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async testWebhook(req) {
    console.log(req);
  }

  private async calculateValue(
    createPaymentDto: CreatePaymentDto,
  ): Promise<number> {
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

        return serviceData.price;
      } else {
        let servicesLocal = [];
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

        return total;
      }
    } else if (createPaymentDto.package != null) {
      const packageData = await this.prisma.packages.findFirst({
        where: {
          id: createPaymentDto.package,
        },
      });

      return packageData.price;
    } else {
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
      Companies: Companies[];
      User: User;
    },
    totalVal: number,
    paymentData: any,
    discount?: number,
    voucherId?: number,
  ) {
    return await this.prisma.payments.create({
      data: {
        clientId: clientData.id,
        companiesId: clientData.Companies[0].id,
        value: totalVal,
        discount: discount,
        voucherId,
        status: 'FINISHED_PAYMENT',
        logGateway: JSON.stringify(paymentData),
        updatedAt: new Date(),
      },
    });
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
