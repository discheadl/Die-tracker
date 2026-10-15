import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./users.service").SafeUser>;
    findAll(): Promise<import("./users.service").SafeUser[]>;
    remove(id: string): Promise<void>;
}
