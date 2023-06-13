import { PartialType } from '@nestjs/swagger';
import { CreateContratedServiceDto } from './create-contrated-service.dto';

export class UpdateContratedServiceDto extends PartialType(CreateContratedServiceDto) {}
