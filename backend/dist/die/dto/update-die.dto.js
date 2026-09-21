"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDieDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_die_dto_1 = require("./create-die.dto");
class UpdateDieDto extends (0, mapped_types_1.PartialType)(create_die_dto_1.CreateDieDto) {
}
exports.UpdateDieDto = UpdateDieDto;
//# sourceMappingURL=update-die.dto.js.map