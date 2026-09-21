import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(createLocationDto: CreateLocationDto): Promise<import("./entities/location.entity").Location>;
    findAll(): Promise<import("./entities/location.entity").Location[]>;
    findOne(id: string): Promise<import("./entities/location.entity").Location>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<import("./entities/location.entity").Location>;
    remove(id: string): Promise<import("./entities/location.entity").Location>;
}
