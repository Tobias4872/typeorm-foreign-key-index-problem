import { Column, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany,
         OneToOne, PrimaryGeneratedColumn, Table } from "typeorm";

@Table()
export class PlayerSpecification {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 128,
    })
    public name: string;

}
