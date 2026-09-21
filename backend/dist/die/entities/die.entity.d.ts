import { Maintenance } from "../../maintenance/entities/maintenance.entity";
import { Location } from "../../locations/entities/location.entity";
export declare enum DieStatus {
    RUN = "run",
    RUN_SOMETIMES = "runSometimes",
    NOT_RUNNING = "notRunning"
}
export declare class Die {
    id: number;
    dieNumber: string;
    rotorNumber: string;
    statorNumber: string;
    status: DieStatus;
    maintenance: Maintenance[];
    location: Location;
    hits: number;
    hitsThreshold: number;
    notes: string;
}
