import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class CreateTaskDto {
    @IsNotEmpty()
    title: string

    @IsOptional()
    description: string

    @IsNotEmpty()
    created_by: string
}
