import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { DieStatus } from "../entities/die.entity";


export class CreateDieDto {
    @IsString()
    @IsNotEmpty()
    dieNumber: string

    @IsString()
    rotorNumber: string

    @IsString()
    statorNumber: string

    @IsEnum(DieStatus)
    status: DieStatus

    @IsInt()
    locationId: number

    @IsNumber()
    @Min(0)
    hits: number

    @IsNumber()
    @Min(0)
    @IsOptional()
    hitsThreshold?: number

    @IsString()
    @IsOptional()
    notes: string
}
