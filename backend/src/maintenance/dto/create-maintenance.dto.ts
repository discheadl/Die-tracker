import { IsDateString, IsEnum, IsInt, IsNumber, IsString } from "class-validator";
import { MaintenanceType } from "../entities/maintenance.entity";

export class CreateMaintenanceDto {
    @IsDateString()
    performedAt: Date;

    @IsEnum(MaintenanceType)
    type: MaintenanceType

    @IsNumber()
    hitsAtMaintenance: number

    @IsString()
    notes: string

    @IsInt()
    dieId: number;
}
