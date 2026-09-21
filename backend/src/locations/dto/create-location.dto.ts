import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LocationType } from "../entities/location.entity";
import { Transform } from "class-transformer";


export class CreateLocationDto {
    @IsEnum(LocationType)
    type: LocationType;

    @Transform(({value}) => value.trim().toUpperCase())
    @IsString()
    @IsNotEmpty()
    name: string


}
