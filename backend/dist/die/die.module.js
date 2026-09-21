"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiesModule = void 0;
const common_1 = require("@nestjs/common");
const die_service_1 = require("./die.service");
const die_controller_1 = require("./die.controller");
const typeorm_1 = require("@nestjs/typeorm");
const die_entity_1 = require("./entities/die.entity");
const location_entity_1 = require("../locations/entities/location.entity");
let DiesModule = class DiesModule {
};
exports.DiesModule = DiesModule;
exports.DiesModule = DiesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([die_entity_1.Die, location_entity_1.Location])],
        controllers: [die_controller_1.DiesController],
        providers: [die_service_1.DiesService],
    })
], DiesModule);
//# sourceMappingURL=die.module.js.map