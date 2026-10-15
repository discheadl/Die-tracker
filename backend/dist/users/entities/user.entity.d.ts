export declare enum UserRole {
    ADMIN = "admin",
    OPERATOR = "operator",
    MAINTENANCE = "maintenance"
}
export declare class User {
    id: number;
    username: string;
    passwordHash: string;
    role: UserRole;
}
