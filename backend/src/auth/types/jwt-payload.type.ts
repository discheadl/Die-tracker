import { UserRole } from '../../users/entities/user.entity';

export interface JwtPayload {
    sub: number;
    username: string;
    role: UserRole;
}

export interface AuthUser {
    userId: number;
    username: string;
    role: UserRole;
}
