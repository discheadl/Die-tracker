import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Die } from "../../die/entities/die.entity"

export enum MaintenanceType {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
}

@Entity()
export class Maintenance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date" })
    performedAt: Date;

    @Column({ type: "enum", enum: MaintenanceType })
    type: MaintenanceType;

    @Column()
    hitsAtMaintenance: number;

    @Column({ type: "text", nullable: true })
    notes: string;

    @ManyToOne(() => Die, (die) => die.maintenance)
    die: Die;
}
