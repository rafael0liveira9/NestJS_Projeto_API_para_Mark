import { ApiProperty } from '@nestjs/swagger';
import { CreditCardDto } from './payment-method.dto';

export class CreatePaymentDto {
  @ApiProperty()
  companieId?: number;
  @ApiProperty()
  contratedServiceId?: number;
  @ApiProperty()
  package?: number;
  @ApiProperty()
  service?: number | number[];
  @ApiProperty()
  paymentMethod: CreditCardDto;
}
