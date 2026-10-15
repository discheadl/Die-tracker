import { Die } from "../../die/entities/die.entity";
export declare enum MaintenanceType {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export declare class Maintenance {
    id: number;
    performedAt: Date;
    type: MaintenanceType;
    hitsAtMaintenance: number;
    notes: string;
    repairedBy: string;
    die: Die;
}
