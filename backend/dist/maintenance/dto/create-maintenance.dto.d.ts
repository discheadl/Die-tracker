import { MaintenanceType } from "../entities/maintenance.entity";
export declare class CreateMaintenanceDto {
    performedAt: Date;
    type: MaintenanceType;
    hitsAtMaintenance: number;
    notes: string;
    dieId: number;
}
