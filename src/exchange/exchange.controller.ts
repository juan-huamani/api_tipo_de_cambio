import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { ExchangeService } from './exchange.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiProperty } from '@nestjs/swagger';

class ExchangeRateResponse {
    @ApiProperty({ description: 'Monto', example: 100 })
    monto: number;

    @ApiProperty({ description: 'Monto con tipo de cambio', example: 50 })
    montoConTipoCambio: number;

    @ApiProperty({ description: 'Moneda de origen', example: 'USD' })
    monedaOrigen: string;

    @ApiProperty({ description: 'Moneda de destino', example: 'EUR' })
    monedaDestino: string;

    @ApiProperty({ description: 'Tipo de cambio', example: 0.5 })
    tipoDeCambio: number;
}

class CreateExchangeRateDto {
    @ApiProperty({ description: 'Moneda de origen', example: 'USD' })
    from: string;

    @ApiProperty({ description: 'Moneda de destino', example: 'EUR' })
    to: string;

    @ApiProperty({ description: 'Tasa de cambio inicial', example: 0.5 })
    initialRate: number;
}

class CreateExchangeRateResponse {
    @ApiProperty({ description: 'Mensaje', example: 'Tipo de cambio creado exitosamente' })
    message: string;

    @ApiProperty({ description: 'Nuevo tipo de cambio', type: CreateExchangeRateDto })
    newExchange: CreateExchangeRateDto;
}

class UpdateExchangeRateDto {
    @ApiProperty({ description: 'Moneda de origen', example: 'USD' })
    from: string;

    @ApiProperty({ description: 'Moneda de destino', example: 'EUR' })
    to: string;

    @ApiProperty({ description: 'Nueva tasa de cambio', example: 0.6 })
    exchangeRate: number;
}

class UpdateExchangeRateResponse {
    @ApiProperty({ description: 'Mensaje', example: 'Tipo de cambio actualizado exitosamente' })
    message: string;

    @ApiProperty({ description: 'Tipo de cambio actualizado', type: UpdateExchangeRateDto })
    updatedExchange: UpdateExchangeRateDto;
}

class AllExchangeRatesResponse {
    @ApiProperty({ description: 'Todas las tasas de cambio', type: ExchangeRateResponse, isArray: true })
    allExchangeRates: ExchangeRateResponse[];
}

@ApiTags('Tasa de Cambio')
@Controller('exchange')
export class ExchangeController {
    constructor(private readonly exchangeService: ExchangeService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el tipo de cambio' })
    @ApiResponse({ status: 200, description: 'Tipo de cambio obtenido correctamente', type: ExchangeRateResponse })
    async getExchangeRate(
        @Query('monto') monto: number,
        @Query('monedaOrigen') monedaOrigen: string,
        @Query('monedaDestino') monedaDestino: string,
    ) { 
        try {
            const exchangeRate = await this.exchangeService.getExchangeRate(monedaOrigen, monedaDestino);
            const montoConTipoCambio = monto * exchangeRate;

            return {
                monto,
                montoConTipoCambio,
                monedaOrigen,
                monedaDestino,
                tipoDeCambio: exchangeRate,
            };
        } catch (error) {
            throw new HttpException('Error al obtener el tipo de cambio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @Post('/create-rate')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Crear nuevo tipo de cambio' })
    @ApiResponse({ status: 201, description: 'Tipo de cambio creado exitosamente', type: CreateExchangeRateResponse })
    @ApiBody({ type: CreateExchangeRateDto })
    async createExchangeRate(@Body() data: CreateExchangeRateDto) {
        try {
            const newExchange = await this.exchangeService.createExchangeRate(data.from, data.to, data.initialRate);
    
            return {
                message: 'Tipo de cambio creado exitosamente',
                newExchange,
            };
        } catch (error) {
            throw new HttpException('Error al crear el tipo de cambio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('/update-rate')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Actualizar tipo de cambio existente' })
    @ApiResponse({ status: 200, description: 'Tipo de cambio actualizado exitosamente', type: UpdateExchangeRateResponse })
    @ApiBody({ type: UpdateExchangeRateDto })
    async updateExchangeRate(@Body() data: UpdateExchangeRateDto) {
        try {
            const updatedExchange = await this.exchangeService.updateExchangeRate(data.from, data.to, data.exchangeRate);
    
            return {
                message: 'Tipo de cambio actualizado exitosamente',
                updatedExchange,
            };
        } catch (error) {
            throw new HttpException('Error al actualizar el tipo de cambio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/all-rates')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener todas las tasas de cambio' })
    @ApiResponse({ status: 200, description: 'Todas las tasas de cambio obtenidas correctamente', type: AllExchangeRatesResponse })
    async getAllExchangeRates() {
        try {
            const allExchangeRates = await this.exchangeService.getAllExchangeRates();
            return {
                allExchangeRates,
            };
        } catch (error) {
            throw new HttpException('Error al obtener todas las tasas de cambio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


