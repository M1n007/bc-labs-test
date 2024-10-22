import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CryptoService } from '../services/crypto.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { PriceAlertDto } from '../dtos/set-alert.dto';
import { GetSwapRateDto } from '../dtos/get-swap-rate.dto';

@ApiTags('Crypto v1')
@Controller('crypto/v1')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) { }

  @Post('set-alert')
  @ApiBody({ type: PriceAlertDto })
  async setPriceAlert(
    @Body() payload: PriceAlertDto,
  ) {
    return await this.cryptoService.setPriceAlert(payload);
  }

  @Post('swap-rate')
  @ApiBody({ type: GetSwapRateDto })
  async getSwapRate(
    @Body() getSwapRateDto: GetSwapRateDto
  ) {
    return await this.cryptoService.getSwapRate(getSwapRateDto);
  }

  @Get('hourly-prices')
  async getHourlyPrices(
    @Query('token') tokenName: string,
    @Query('chain') chain: string,
  ) {
    if (!tokenName || !chain) {
      throw new BadRequestException('token and chain are required parameters');
    }

    const hourlyPrices = await this.cryptoService.getHourlyPrices(tokenName, chain);
    return {
      token_name: tokenName,
      chain: chain,
      hourlyPrices,
    };
  }

}
