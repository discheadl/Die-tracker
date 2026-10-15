import { DieStatus } from "../entities/die.entity";
export declare class CreateDieDto {
    dieNumber: string;
    rotorNumber?: string;
    statorNumber?: string;
    status: DieStatus;
    locationId?: number;
    hits: number;
    hitsThreshold?: number;
    notes: string;
}
