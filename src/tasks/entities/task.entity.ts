import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "users"})
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string
    
    @Column()
    description: string
    
    @Column({default: false})
    completed: boolean
    
    @Column()
    created_by: number
}
