import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exchange } from './exchange.entity';

@Injectable()
export class ExchangeService {
    constructor(
        @InjectRepository(Exchange)
        private exchangeRepository: Repository<Exchange>,
    ) {}
    
    async createExchangeRate(from: string, to: string, initialRate: number): Promise<Exchange> {
        const newExchange = this.exchangeRepository.create({
            currencyFrom: from,
            currencyTo: to,
            exchangeRate: initialRate,
        });
    
        return this.exchangeRepository.save(newExchange);
    }

    async updateExchangeRate(from: string, to: string, newRate: number): Promise<Exchange | null> {
        const exchange = await this.exchangeRepository.findOne({ where: { currencyFrom: from, currencyTo: to }, });
    
        if (exchange) {
            exchange.exchangeRate = newRate;
            return this.exchangeRepository.save(exchange);
        }
    
        return null;
    }

    async getAllExchangeRates(): Promise<Exchange[]> {
        return this.exchangeRepository.find();
    }

    async getExchangeRate(from: string, to: string): Promise<number> {
        const exchange = await this.exchangeRepository.findOne({
        where: { currencyFrom: from, currencyTo: to },
        });

        return exchange ? exchange.exchangeRate : 0;
    }
}
