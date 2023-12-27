import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from '../../src/exchange/exchange.controller';
import { ExchangeService } from '../../src/exchange/exchange.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Exchange } from '../../src/exchange/exchange.entity';

jest.mock('../../src/exchange/exchange.service');

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let exchangeService: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [ExchangeService],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    exchangeService = module.get<ExchangeService>(ExchangeService);
  });

  describe('getExchangeRate', () => {
    it('should return exchange rate details', async () => {
      const exchangeRate = 0.5;
      jest.spyOn(exchangeService, 'getExchangeRate').mockResolvedValueOnce(exchangeRate);

      const result = await controller.getExchangeRate(100,'USD','EUR');

      expect(result).toEqual({
        monto: 100,
        montoConTipoCambio: 50,
        monedaOrigen: 'USD',
        monedaDestino: 'EUR',
        tipoDeCambio: 0.5,
      });
    });

    it('should handle errors and throw HttpException', async () => {
      jest.spyOn(exchangeService, 'getExchangeRate').mockRejectedValueOnce(new Error('Some error'));

      await expect(
        controller.getExchangeRate(100,'USD','EUR')
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('createExchangeRate', () => {
    // Puedes seguir un patrón similar para otras funciones del controlador
    it('should create exchange rate', async () => {
        // Declara la variable antes de usarla
        const newExchange: Exchange = {
            id: 1,
            currencyFrom: 'USD',
            currencyTo: 'EUR',
            exchangeRate: 0.5,
        };
        jest.spyOn(exchangeService, 'createExchangeRate').mockResolvedValueOnce(newExchange);
      
        const result = await controller.createExchangeRate({
          from: 'USD',
          to: 'EUR',
          initialRate: 0.5,
        });
      
        expect(result).toEqual({
          message: 'Tipo de cambio creado exitosamente',
          newExchange,
        });
      });
      

    it('should handle errors and throw HttpException', async () => {
      jest.spyOn(exchangeService, 'createExchangeRate').mockRejectedValueOnce(new Error('Some error'));

      await expect(
        controller.createExchangeRate({
          from: 'USD',
          to: 'EUR',
          initialRate: 0.5,
        })
      ).rejects.toThrowError(HttpException);
    });
  });
  
});

// Repite el mismo patrón para otras funciones del controlador (updateExchangeRate, getAllExchangeRates, etc.)
