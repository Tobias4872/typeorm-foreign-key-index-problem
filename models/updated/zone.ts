import { Column, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Table } from "typeorm";
import { PlayerSpecification } from "./player-specification";

@Table()
export class Zone {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({
        length: 128,
    })
    public name: string;

    @ManyToOne((type) => PlayerSpecification, {
        nullable: false,
    })
    @JoinColumn()
    public playerSpecification: PlayerSpecification;

}
