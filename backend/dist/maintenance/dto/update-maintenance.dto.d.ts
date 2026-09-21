import { CreateMaintenanceDto } from './create-maintenance.dto';
declare const UpdateMaintenanceDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<Omit<CreateMaintenanceDto, "dieId">>>;
export declare class UpdateMaintenanceDto extends UpdateMaintenanceDto_base {
}
export {};
