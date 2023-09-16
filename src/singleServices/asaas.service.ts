import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class AsaasService {
  async createCostumer({
    email,
    name,
    phone,
    document,
  }: {
    name: string;
    email: string;
    phone: string;
    document: string;
  }) {
    try {
      const costumerData = await fetch(
        `${process.env.ASAAS_URL}api/v3/customers`,
        {
          method: 'POST',
          headers: {
            access_token: process.env.ASAAS_TOKEN,
          },
          body: JSON.stringify({
            name,
            phone,
            email,
            cpfCnpj: document,
          }),
        },
      );

      return await costumerData.json();
    } catch (error) {
      return error;
    }
  }

  async createPayment({
    costumer,
    creditCard,
    dueDate,
    value,
    description,
    externalReference,
    userInfo,
    installments,
    valueInstall,
    contractTime,
  }: {
    costumer?: string;
    dueDate: string;
    value: number;
    description: string;
    externalReference: string;
    installments: number;
    valueInstall: number;
    contractTime?: number;
    creditCard?: {
      holderName: string;
      number: string;
      expiryMonth: string;
      expiryYear: string;
      ccv: string;
    };
    userInfo: {
      name: string;
      email: string;
      cpf: string;
      cep: string;
      addressNumber: string;
      phoneNumber: string;
    };
  }): Promise<Response> {
    let credit = {};

    if (creditCard != null) {
      credit = {
        creditCard: {
          holderName: creditCard.holderName,
          number: creditCard.number,
          expiryMonth: creditCard.expiryMonth,
          expiryYear: creditCard.expiryYear,
          ccv: creditCard.ccv,
        },
        creditCardHolderInfo: {
          name: userInfo.name,
          email: userInfo.email,
          cpfCnpj: userInfo.cpf,
          postalCode: userInfo.cep,
          addressNumber: userInfo.addressNumber,
          phone: userInfo.phoneNumber,
        },
      };
    }

    const body = {
      customer: costumer,
      billingType: creditCard != null ? 'CREDIT_CARD' : 'BOLETO',
      dueDate: dueDate,
      value: value,
      description: description,
      externalReference: externalReference,
      installmentCount: installments,
      installmentValue: valueInstall,
      ...credit,
    };

    if (contractTime) {
      delete body.installmentCount;
      delete body.installmentValue;
      try {
        const data = await fetch(
          `${process.env.ASAAS_URL}/api/v3/subscriptions`,
          {
            method: 'POST',
            headers: {
              access_token: process.env.ASAAS_TOKEN,
            },
            body: JSON.stringify({
              ...body,
              nextDueDate: moment().add(1, 'M').format('YYYY-MM-DD'),
              cycle: 'MONTHLY',
              maxPayments: contractTime,
            }),
          },
        );

        return data;
      } catch (error) {
        console.log(error);
        return error;
      }
    }

    try {
      const data = await fetch(`${process.env.ASAAS_URL}/api/v3/payments`, {
        method: 'POST',
        headers: {
          access_token: process.env.ASAAS_TOKEN,
        },
        body: JSON.stringify(body),
      });

      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
