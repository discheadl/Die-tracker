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
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const OPERATOR_ALLOWED_FIELDS = ['hits', 'notes'];
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
    async update(id, updateDieDto, user) {
        if (user.role === user_entity_1.UserRole.MAINTENANCE) {
            throw new common_1.ForbiddenException('Tu rol no puede editar dados');
        }
        if (user.role === user_entity_1.UserRole.OPERATOR) {
            const disallowed = Object.keys(updateDieDto).filter((key) => !OPERATOR_ALLOWED_FIELDS.includes(key));
            if (disallowed.length > 0) {
                throw new common_1.ForbiddenException('Como operador solo puedes registrar golpes y notas');
            }
            if (updateDieDto.hits !== undefined) {
                const currentDie = await this.dieService.findOne(+id);
                if (!currentDie)
                    throw new common_1.NotFoundException(`Die ${id} not found`);
                if (updateDieDto.hits < currentDie.hits) {
                    throw new common_1.ForbiddenException('No puedes registrar menos golpes de los que ya tiene el dado');
                }
            }
        }
        return this.dieService.update(+id, updateDieDto);
    }
    remove(id) {
        return this.dieService.remove(+id);
    }
};
exports.DiesController = DiesController;
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
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
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_die_dto_1.UpdateDieDto, Object]),
    __metadata("design:returntype", Promise)
], DiesController.prototype, "update", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
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