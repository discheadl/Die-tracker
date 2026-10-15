import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    login(username: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: number;
            username: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
}
