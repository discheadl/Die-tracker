import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

const SALT_ROUNDS = 10;

export type SafeUser = Omit<User, 'passwordHash'>;

function toSafeUser(user: User): SafeUser {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<SafeUser> {
    const existing = await this.userRepo.findOneBy({ username: createUserDto.username });
    if (existing) throw new ConflictException(`El usuario "${createUserDto.username}" ya existe`);

    const passwordHash = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    const user = this.userRepo.create({
      username: createUserDto.username,
      role: createUserDto.role,
      passwordHash,
    });

    const saved = await this.userRepo.save(user);
    return toSafeUser(saved);
  }

  async findAll(): Promise<SafeUser[]> {
    const users = await this.userRepo.find({ order: { username: 'ASC' } });
    return users.map(toSafeUser);
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    await this.userRepo.remove(user);
  }
}
