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
exports.Die = exports.DieStatus = void 0;
const typeorm_1 = require("typeorm");
const maintenance_entity_1 = require("../../maintenance/entities/maintenance.entity");
const location_entity_1 = require("../../locations/entities/location.entity");
var DieStatus;
(function (DieStatus) {
    DieStatus["RUN"] = "run";
    DieStatus["RUN_SOMETIMES"] = "runSometimes";
    DieStatus["NOT_RUNNING"] = "notRunning";
})(DieStatus || (exports.DieStatus = DieStatus = {}));
let Die = class Die {
    id;
    dieNumber;
    rotorNumber;
    statorNumber;
    status;
    maintenance;
    location;
    hits;
    hitsThreshold;
    notes;
};
exports.Die = Die;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Die.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, name: "die_number" }),
    __metadata("design:type", String)
], Die.prototype, "dieNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "rotor_number" }),
    __metadata("design:type", String)
], Die.prototype, "rotorNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "stator_number" }),
    __metadata("design:type", String)
], Die.prototype, "statorNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: DieStatus }),
    __metadata("design:type", String)
], Die.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => maintenance_entity_1.Maintenance, (maintenance) => maintenance.die),
    __metadata("design:type", Array)
], Die.prototype, "maintenance", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => location_entity_1.Location, (location) => location.dies),
    __metadata("design:type", location_entity_1.Location)
], Die.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Die.prototype, "hits", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "hits_threshold", nullable: true }),
    __metadata("design:type", Number)
], Die.prototype, "hitsThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Die.prototype, "notes", void 0);
exports.Die = Die = __decorate([
    (0, typeorm_1.Entity)()
], Die);
//# sourceMappingURL=die.entity.js.map