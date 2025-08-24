import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateTaskDto {
    @IsNotEmpty()
    title: string

    description: string

    completed: boolean

    @IsNumber()
    @IsNotEmpty()
    created_by: number
}
