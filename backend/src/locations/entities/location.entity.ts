import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"; 
import { Die } from "../../die/entities/die.entity"

export enum LocationType {
    STORAGE = "storage",
    PRESS_POSITION = "pressPosition",
}

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "enum", enum: LocationType })
    type: LocationType;

    @Column({ unique: true })
    name: string;

    @OneToMany(() => Die, (die) => die.location)
    dies: Die[];

}
