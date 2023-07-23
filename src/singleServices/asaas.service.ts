import { Injectable } from '@nestjs/common';

@Injectable()
export class AsaasService {
  async createCostumer({
    email,
    name,
    phone,
  }: {
    name: string;
    email: string;
    phone: string;
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
          }),
        },
      );

      return await costumerData.json();
    } catch (error) {
      return error;
    }
  }

  async createPaymentCreditCard({
    costumer,
    creditCard,
    dueDate,
    value,
    description,
    externalReference,
    userInfo,
    installments,
    valueInstall,
  }: {
    costumer?: string;
    dueDate: string;
    value: number;
    description: string;
    externalReference: string;
    installments: number;
    valueInstall: number;
    creditCard: {
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
    /* 
    "installmentCount": 5,
  "installmentValue": 20,
    
    */
    try {
      const data = await fetch(`${process.env.ASAAS_URL}/api/v3/payments`, {
        method: 'POST',
        headers: {
          access_token: process.env.ASAAS_TOKEN,
        },
        body: JSON.stringify({
          customer: costumer,
          billingType: 'CREDIT_CARD',
          dueDate: dueDate,
          value: value,
          description: description,
          externalReference: externalReference,
          installmentCount: installments,
          installmentValue: valueInstall,
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
        }),
      });

      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
