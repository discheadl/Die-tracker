import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance } from './entities/maintenance.entity';
import { Repository } from 'typeorm';
import { Die } from '../die/entities/die.entity';
export declare class MaintenanceService {
    private maintenanceRepo;
    private dieRepo;
    constructor(maintenanceRepo: Repository<Maintenance>, dieRepo: Repository<Die>);
    create(createMaintenanceDto: CreateMaintenanceDto): Promise<Maintenance>;
    findAll(): Promise<Maintenance[]>;
    findOne(id: number): Promise<Maintenance>;
    update(id: number, updateMaintenanceDto: UpdateMaintenanceDto): Promise<Maintenance>;
    remove(id: number): Promise<Maintenance>;
}
