import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanieDto } from './create-companie.dto';

export class UpdateCompanieDto extends PartialType(CreateCompanieDto) {}
