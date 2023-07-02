import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLogoDto } from './create-logo.dto';

export class UpdateLogoDto extends PartialType(CreateLogoDto) {
  @ApiProperty()
  mockupsUp: MockupModel[];
}

class MockupModel {
  id: number;
  image: number;
}
