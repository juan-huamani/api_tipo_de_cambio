import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExchangeService } from '../../src/exchange/exchange.service';
import { Exchange } from '../../src/exchange/exchange.entity';
import { Repository } from 'typeorm';

describe('ExchangeService', () => {
    let service: ExchangeService;
    let repository: Repository<Exchange>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExchangeService,
                {
                    provide: getRepositoryToken(Exchange),
                    useValue: {
                        findOne: jest.fn(),
                        create: jest.fn(),
                        save: jest.fn(),
                        find: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ExchangeService>(ExchangeService);
        repository = module.get<Repository<Exchange>>(getRepositoryToken(Exchange));
    });

    describe('createExchangeRate', () => {
        
        it('should create a new exchange rate', async () => {
            // Arrange
            const from = 'USD';
            const to = 'EUR';
            const initialRate = 0.5;
            const exchange = { id:1, currencyFrom: from, currencyTo: to, exchangeRate: initialRate };
            const createSpy = jest.spyOn(repository, 'create').mockReturnValue(exchange);
            const saveSpy = jest.spyOn(repository, 'save').mockResolvedValue(exchange);
    
            // Act
            await service.createExchangeRate(from, to, initialRate);
    
            // Assert
            expect(createSpy).toHaveBeenCalledWith({
                currencyFrom: from,
                currencyTo: to,
                exchangeRate: initialRate,
            });
            expect(saveSpy).toHaveBeenCalledWith(exchange);
        });
    });
    describe('updateExchangeRate', () => {
        it('should update an existing exchange rate', async () => {
            // Arrange
            const from = 'USD';
            const to = 'EUR';
            const newRate = 0.6;
            const existingExchange = { id: 1, currencyFrom: from, currencyTo: to, exchangeRate: 0.5 };
            const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingExchange);
            const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce(existingExchange);
    
            // Act
            await service.updateExchangeRate(from, to, newRate);
    
            // Assert
            expect(findOneSpy).toHaveBeenCalledWith({ where: { currencyFrom: from, currencyTo: to } });
            expect(saveSpy).toHaveBeenCalledWith({
                id: 1,
                currencyFrom: from,
                currencyTo: to,
                exchangeRate: newRate,
            });
        });

        it('should return null for non-existing exchange rate', async () => {
        const from = 'USD';
        const to = 'EUR';
        const newRate = 0.6;

        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

        const result = await service.updateExchangeRate(from, to, newRate);

        expect(result).toBeNull();
        });
    });

    describe('getAllExchangeRates', () => {
        it('should return all exchange rates', async () => {
            // Arrange
            const exchangeRates = [{ id: 1, currencyFrom: 'USD', currencyTo: 'EUR', exchangeRate: 0.5 }];
            jest.spyOn(repository, 'find').mockResolvedValueOnce(exchangeRates);
    
            // Act
            const result = await service.getAllExchangeRates();
    
            // Assert
            expect(result).toEqual(exchangeRates);
            expect(repository.find).toHaveBeenCalled();
        });
    });

    describe('getExchangeRate', () => {
        it('should return exchange rate for existing currencies', async () => {
        const from = 'USD';
        const to = 'EUR';

        const findOneSpy = jest.spyOn(repository, 'findOne').mockResolvedValueOnce({
            id: 1,
            currencyFrom: from,
            currencyTo: to,
            exchangeRate: 0.5,
        });

        const result = await service.getExchangeRate(from, to);

        expect(findOneSpy).toHaveBeenCalledWith({ where: { currencyFrom: from, currencyTo: to } });
        expect(result).toBe(0.5);
        });

        it('should return 0 for non-existing currencies', async () => {
        const from = 'USD';
        const to = 'EUR';

        jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);

        const result = await service.getExchangeRate(from, to);

        expect(result).toBe(0);
        });
    });

    
});
