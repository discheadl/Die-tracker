import { DiesService } from './die.service';
import { CreateDieDto } from './dto/create-die.dto';
import { UpdateDieDto } from './dto/update-die.dto';
export declare class DiesController {
    private readonly dieService;
    constructor(dieService: DiesService);
    create(createDieDto: CreateDieDto): Promise<import("./entities/die.entity").Die>;
    findAll(): Promise<import("./entities/die.entity").Die[]>;
    findOne(id: string): Promise<import("./entities/die.entity").Die | null>;
    update(id: string, updateDieDto: UpdateDieDto): Promise<import("./entities/die.entity").Die>;
    remove(id: string): Promise<import("./entities/die.entity").Die>;
}
