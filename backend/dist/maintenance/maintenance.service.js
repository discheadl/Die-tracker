"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const maintenance_entity_1 = require("./entities/maintenance.entity");
const typeorm_2 = require("typeorm");
const die_entity_1 = require("../die/entities/die.entity");
let MaintenanceService = class MaintenanceService {
    maintenanceRepo;
    dieRepo;
    constructor(maintenanceRepo, dieRepo) {
        this.maintenanceRepo = maintenanceRepo;
        this.dieRepo = dieRepo;
    }
    async create(createMaintenanceDto) {
        const { dieId, ...maintenanceData } = createMaintenanceDto;
        const die = await this.dieRepo.findOneBy({ id: dieId });
        if (!die)
            throw new common_1.NotFoundException(`Die ${dieId} not found`);
        const maintenance = this.maintenanceRepo.create({ ...maintenanceData, die });
        return this.maintenanceRepo.save(maintenance);
    }
    findAll() {
        return this.maintenanceRepo.find({ relations: { die: true } });
    }
    async findOne(id) {
        const maintenance = await this.maintenanceRepo.findOne({ where: { id }, relations: { die: true } });
        if (!maintenance)
            throw new common_1.NotFoundException(`Maintenance ${id} not found`);
        return maintenance;
    }
    async update(id, updateMaintenanceDto) {
        const maintenance = await this.maintenanceRepo.preload({ id, ...updateMaintenanceDto });
        if (!maintenance)
            throw new common_1.NotFoundException(`Maintenance ${id} not found`);
        return this.maintenanceRepo.save(maintenance);
    }
    async remove(id) {
        const maintenance = await this.maintenanceRepo.findOneBy({ id });
        if (!maintenance)
            throw new common_1.NotFoundException(`Maintenance ${id} not found`);
        return this.maintenanceRepo.remove(maintenance);
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(maintenance_entity_1.Maintenance)),
    __param(1, (0, typeorm_1.InjectRepository)(die_entity_1.Die)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map