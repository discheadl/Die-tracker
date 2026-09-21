import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateMaintenanceDto } from './create-maintenance.dto';

export class UpdateMaintenanceDto extends PartialType (
    OmitType(CreateMaintenanceDto, ['dieId'] as const)  
) {}
