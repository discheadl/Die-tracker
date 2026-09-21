import { CreateDieDto } from './dto/create-die.dto';
import { UpdateDieDto } from './dto/update-die.dto';
import { Repository } from 'typeorm';
import { Die } from './entities/die.entity';
import { Location } from '../locations/entities/location.entity';
export declare class DiesService {
    private dieRepo;
    private locationRepo;
    constructor(dieRepo: Repository<Die>, locationRepo: Repository<Location>);
    create(createDieDto: CreateDieDto): Promise<Die>;
    findAll(): Promise<Die[]>;
    findOne(id: number): Promise<Die | null>;
    update(id: number, updateDieDto: UpdateDieDto): Promise<Die>;
    remove(id: number): Promise<Die>;
}
