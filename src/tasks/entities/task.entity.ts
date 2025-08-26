import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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
    
    @CreateDateColumn()
    created_at: Date
    
    @Column()
    created_by: number
}
