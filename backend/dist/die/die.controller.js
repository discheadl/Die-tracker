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
exports.DiesController = void 0;
const common_1 = require("@nestjs/common");
const die_service_1 = require("./die.service");
const create_die_dto_1 = require("./dto/create-die.dto");
const update_die_dto_1 = require("./dto/update-die.dto");
let DiesController = class DiesController {
    dieService;
    constructor(dieService) {
        this.dieService = dieService;
    }
    create(createDieDto) {
        return this.dieService.create(createDieDto);
    }
    findAll() {
        return this.dieService.findAll();
    }
    findOne(id) {
        return this.dieService.findOne(+id);
    }
    update(id, updateDieDto) {
        return this.dieService.update(+id, updateDieDto);
    }
    remove(id) {
        return this.dieService.remove(+id);
    }
};
exports.DiesController = DiesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_die_dto_1.CreateDieDto]),
    __metadata("design:returntype", void 0)
], DiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_die_dto_1.UpdateDieDto]),
    __metadata("design:returntype", void 0)
], DiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DiesController.prototype, "remove", null);
exports.DiesController = DiesController = __decorate([
    (0, common_1.Controller)('die'),
    __metadata("design:paramtypes", [die_service_1.DiesService])
], DiesController);
//# sourceMappingURL=die.controller.js.map