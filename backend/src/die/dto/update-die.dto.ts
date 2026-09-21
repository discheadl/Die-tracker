import { PartialType } from '@nestjs/mapped-types';
import { CreateDieDto } from './create-die.dto';

export class UpdateDieDto extends PartialType(CreateDieDto) {}
