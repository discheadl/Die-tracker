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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maintenance = exports.MaintenanceType = void 0;
const typeorm_1 = require("typeorm");
const die_entity_1 = require("../../die/entities/die.entity");
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["LOW"] = "low";
    MaintenanceType["MEDIUM"] = "medium";
    MaintenanceType["HIGH"] = "high";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
let Maintenance = class Maintenance {
    id;
    performedAt;
    type;
    hitsAtMaintenance;
    notes;
    die;
};
exports.Maintenance = Maintenance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Maintenance.prototype, "performedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: MaintenanceType }),
    __metadata("design:type", String)
], Maintenance.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Maintenance.prototype, "hitsAtMaintenance", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Maintenance.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => die_entity_1.Die, (die) => die.maintenance),
    __metadata("design:type", die_entity_1.Die)
], Maintenance.prototype, "die", void 0);
exports.Maintenance = Maintenance = __decorate([
    (0, typeorm_1.Entity)()
], Maintenance);
//# sourceMappingURL=maintenance.entity.js.map