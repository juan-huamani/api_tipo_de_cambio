import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exchange {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    currencyFrom: string;

    @Column()
    currencyTo: string;

    @Column('decimal', { precision: 10, scale: 2 })
    exchangeRate: number;
}
