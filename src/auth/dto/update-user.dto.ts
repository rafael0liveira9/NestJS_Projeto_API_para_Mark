import { PartialType } from '@nestjs/mapped-types';
import { UserDefault } from './create-user.dto';

export class UpdateUser extends PartialType(UserDefault) {}
