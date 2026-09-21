import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Maintenance } from "../../maintenance/entities/maintenance.entity"
import { Location } from "../../locations/entities/location.entity";

export enum DieStatus {
    RUN = "run",
    RUN_SOMETIMES = "runSometimes",
    NOT_RUNNING = "notRunning"

}

@Entity()
export class Die {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, name: "die_number" })
    dieNumber: string;

    @Column({ name: "rotor_number" })
    rotorNumber: string;

    @Column({ name: "stator_number" })
    statorNumber: string;

    @Column({ type: "enum", enum: DieStatus })
    status: DieStatus;

    @OneToMany(() => Maintenance, (maintenance) => maintenance.die)
    maintenance: Maintenance[];

    @ManyToOne(() => Location, (location) => location.dies)
    location: Location;

    @Column({ default: 0 })
    hits: number;

    @Column({ name: "hits_threshold", nullable: true })
    hitsThreshold: number;

    @Column({type: "text", nullable: true})
    notes: string;
}