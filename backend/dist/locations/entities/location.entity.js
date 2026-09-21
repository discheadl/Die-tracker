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
exports.Location = exports.LocationType = void 0;
const typeorm_1 = require("typeorm");
const die_entity_1 = require("../../die/entities/die.entity");
var LocationType;
(function (LocationType) {
    LocationType["STORAGE"] = "storage";
    LocationType["PRESS_POSITION"] = "pressPosition";
})(LocationType || (exports.LocationType = LocationType = {}));
let Location = class Location {
    id;
    type;
    name;
    dies;
};
exports.Location = Location;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Location.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: LocationType }),
    __metadata("design:type", String)
], Location.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Location.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => die_entity_1.Die, (die) => die.location),
    __metadata("design:type", Array)
], Location.prototype, "dies", void 0);
exports.Location = Location = __decorate([
    (0, typeorm_1.Entity)()
], Location);
//# sourceMappingURL=location.entity.js.map