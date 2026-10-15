import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export type SafeUser = Omit<User, 'passwordHash'>;
export declare class UsersService {
    private userRepo;
    constructor(userRepo: Repository<User>);
    create(createUserDto: CreateUserDto): Promise<SafeUser>;
    findAll(): Promise<SafeUser[]>;
    findByUsername(username: string): Promise<User | null>;
    remove(id: number): Promise<void>;
}
