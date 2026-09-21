import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    create(createMaintenanceDto: CreateMaintenanceDto): Promise<import("./entities/maintenance.entity").Maintenance>;
    findAll(): Promise<import("./entities/maintenance.entity").Maintenance[]>;
    findOne(id: string): Promise<import("./entities/maintenance.entity").Maintenance>;
    update(id: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<import("./entities/maintenance.entity").Maintenance>;
    remove(id: string): Promise<import("./entities/maintenance.entity").Maintenance>;
}
