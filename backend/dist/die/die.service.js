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
exports.DiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const die_entity_1 = require("./entities/die.entity");
const location_entity_1 = require("../locations/entities/location.entity");
let DiesService = class DiesService {
    dieRepo;
    locationRepo;
    constructor(dieRepo, locationRepo) {
        this.dieRepo = dieRepo;
        this.locationRepo = locationRepo;
    }
    async create(createDieDto) {
        const { locationId, ...dieData } = createDieDto;
        const location = await this.locationRepo.findOneBy({ id: locationId });
        if (!location)
            throw new common_1.NotFoundException(`Location ${locationId} not found`);
        const die = this.dieRepo.create({ ...dieData, location });
        return this.dieRepo.save(die);
    }
    findAll() {
        return this.dieRepo.find({ relations: { location: true } });
    }
    findOne(id) {
        return this.dieRepo.findOne({ where: { id }, relations: { location: true } });
    }
    async update(id, updateDieDto) {
        const { locationId, ...dieData } = updateDieDto;
        let location;
        if (locationId !== undefined) {
            location = await this.locationRepo.findOneBy({ id: locationId });
            if (!location)
                throw new common_1.NotFoundException(`Location ${locationId} not found`);
        }
        const die = await this.dieRepo.preload({ id, ...dieData, ...(location && { location }) });
        if (!die)
            throw new common_1.NotFoundException(`Die ${id} not found`);
        return this.dieRepo.save(die);
    }
    async remove(id) {
        const die = await this.dieRepo.findOneBy({ id });
        if (!die)
            throw new common_1.NotFoundException(`Die ${id} not found`);
        return this.dieRepo.remove(die);
    }
};
exports.DiesService = DiesService;
exports.DiesService = DiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(die_entity_1.Die)),
    __param(1, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DiesService);
//# sourceMappingURL=die.service.js.map