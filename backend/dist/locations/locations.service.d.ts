import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Die } from '../die/entities/die.entity';
export declare class LocationsService {
    private locationRepo;
    private dieRepo;
    constructor(locationRepo: Repository<Location>, dieRepo: Repository<Die>);
    create(createLocationDto: CreateLocationDto): Promise<Location>;
    findAll(): Promise<Location[]>;
    findOne(id: number): Promise<Location>;
    update(id: number, updateLocationDto: UpdateLocationDto): Promise<Location>;
    remove(id: number): Promise<Location>;
}
