import { Die } from "../../die/entities/die.entity";
export declare enum LocationType {
    STORAGE = "storage",
    PRESS_POSITION = "pressPosition"
}
export declare class Location {
    id: number;
    type: LocationType;
    name: string;
    dies: Die[];
}
