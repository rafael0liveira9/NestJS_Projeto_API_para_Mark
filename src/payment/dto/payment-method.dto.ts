import { ApiProperty } from '@nestjs/swagger';

class CreditCard {
  @ApiProperty()
  holderName: string;
  @ApiProperty()
  number: string;
  @ApiProperty()
  expiryMonth: string;
  @ApiProperty()
  expiryYear: string;
  @ApiProperty()
  ccv: string;
}

export class CreditCardDto {
  @ApiProperty()
  customer: string;
  billingType: 'CREDIT_CARD';
  creditCard: CreditCard;
}
