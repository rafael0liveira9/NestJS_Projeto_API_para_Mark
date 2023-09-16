import { ApiProperty } from '@nestjs/swagger';
import { CreditCardDto, InvoiceDto } from './payment-method.dto';

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
  paymentMethod: CreditCardDto | InvoiceDto;
  @ApiProperty()
  installments?: number | 1;
  @ApiProperty()
  contractTime?: 3 | 6 | 12;
}
