import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    MAINTENANCE = "maintenance",
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ name: "password_hash" })
    passwordHash: string;

    @Column({ type: "enum", enum: UserRole })
    role: UserRole;
}
