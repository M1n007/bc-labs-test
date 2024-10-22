import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Price } from 'entities/price.entity';
import Moralis from 'moralis';
import { SolNetwork } from 'moralis/common-sol-utils';
import { EmailService } from './email.service';
import { PriceHistory } from 'entities/price-history.entity';
import { PriceAlert } from 'entities/price-alert.entity';
import { PriceAlertDto } from '../dtos/set-alert.dto';
import { GetSwapRateDto } from '../dtos/get-swap-rate.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);
  private readonly coingeckoApiUrl: string;
  private readonly coingeckoApiKey: string;



  constructor(
    @InjectRepository(Price)
    private readonly priceRepo: Repository<Price>,

    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepo: Repository<PriceHistory>,

    @InjectRepository(PriceAlert)
    private readonly priceAlertRepo: Repository<PriceAlert>,

    @Inject('MORALIS')
    private readonly moralis: typeof Moralis,

    private readonly emailService: EmailService,

    private readonly httpService: HttpService,

    private readonly configService: ConfigService,

  ) { 

    this.coingeckoApiUrl = this.configService.get<string>('COINGECKO_API_URL');
    this.coingeckoApiKey = this.configService.get<string>('COINGECKO_API_KEY');

  }

  async setPriceAlert(payload: PriceAlertDto): Promise<{ message: string }> {
    const {
      token_name,
      target_price,
      chain
    } = payload;
    const newAlert = this.priceAlertRepo.create(payload);

    await this.priceAlertRepo.save(newAlert);
    this.logger.debug(`Price alert set for ${token_name} on ${chain} at $${target_price}`);
    return { message: `Price alert set for ${token_name} at $${target_price} has been created.` };
  }

  async checkPriceAlerts() {
    const alerts = await this.priceAlertRepo.find();

    for (const alert of alerts) {
      const { token_name, chain, target_price, email } = alert;

      const currentPrice = await this.priceRepo.findOne({
        where: { token_name, chain },
        order: { updated_at: 'DESC' },
      });

      if (currentPrice && currentPrice.price >= target_price) {
        await this.sendPriceAlertEmail(token_name, chain, target_price, currentPrice.price, email);
      }
    }
  }

  async getHourlyPrices(tokenName: string, chain: string): Promise<PriceHistory[]> {
    const currentTime = new Date();
    const past24Hours = new Date(currentTime);
    past24Hours.setHours(past24Hours.getHours() - 24);

    const hourlyPrices = await this.priceHistoryRepo.find({
      where: {
        token_name: tokenName,
        chain: chain,
        recorded_at: Between(past24Hours, currentTime),
      },
      order: {
        recorded_at: 'ASC',
      },
    });

    return hourlyPrices;
  }

  @Cron('*/1 * * * *')
  async fetchAndSavePrices() {
    this.logger.debug('Fetching and saving prices');

    try {
      const [ethResponse, solResponse] = await Promise.all([
        this.moralis.EvmApi.token.getTokenPrice({
          chain: '0x1',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        }),
        this.moralis.SolApi.token.getTokenPrice({
          network: SolNetwork.MAINNET,
          address: 'So11111111111111111111111111111111111111112',
        }),
      ]);

      const ethPrice = parseFloat(ethResponse.toJSON().usdPrice.toFixed(2));
      const solPrice = parseFloat(solResponse.toJSON().usdPrice.toFixed(2));

      this.logger.debug(`ETH Price: $${ethPrice}, SOL Price: $${solPrice}`);

      await this.priceRepo.upsert([
        { token_name: 'ETH', chain: 'ethereum', price: ethPrice },
        { token_name: 'SOL', chain: 'solana', price: solPrice },
      ], ['token_name']);

      await this.priceHistoryRepo.save([
        { token_name: 'ETH', chain: 'ethereum', price: ethPrice },
        { token_name: 'SOL', chain: 'solana', price: solPrice },
      ]);

      await this.checkPriceIncreaseAndSendEmail();
      await this.checkPriceAlerts();
    } catch (error) {
      this.logger.error('Failed to fetch prices:', error);
    }
  }

  async checkPriceIncreaseAndSendEmail() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
    const currentPrices = await this.priceRepo.find({
      where: {
        token_name: In(['ETH', 'SOL']),
      },
    });
  
    for (const currentPriceRecord of currentPrices) {
      const { token_name, chain, price: currentPrice } = currentPriceRecord;
  
      const pastPriceRecord = await this.priceHistoryRepo.findOne({
        where: {
          token_name,
          chain,
          recorded_at: LessThan(oneHourAgo),
        },
        order: { recorded_at: 'DESC' },
      });
  
      if (!pastPriceRecord) {
        this.logger.debug(`No past price found for ${token_name}`);
        continue;
      }
  
      const priceIncrease = ((currentPrice - pastPriceRecord.price) / pastPriceRecord.price) * 100;
      this.logger.debug(`Price increase for ${token_name}: ${priceIncrease}%`);
  
      if (priceIncrease > 3) {
        await this.sendPriceIncreaseEmail(token_name, chain, priceIncrease);
      }
    }
  }

  async getSwapRate({ eth_amount }: GetSwapRateDto) {
    try {
      const ethPriceResponse = await this.moralis.EvmApi.token.getTokenPrice({
        chain: '0x1',
        address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      });
      
      const btcPriceInUSD = await this.getBitcoinPrice();
      const ethPriceInUSD = parseFloat(ethPriceResponse.toJSON().usdPrice.toFixed(2));

      const ethValueInUSD = eth_amount * ethPriceInUSD;
      const btcAmount = ethValueInUSD / btcPriceInUSD;

      const ethFee = eth_amount * 0.03;
      const ethFeeInUSD = ethFee * ethPriceInUSD;

      return {
        btc_amount: btcAmount,
        fee: {
          eth: ethFee,
          usd: ethFeeInUSD,
        },
      };
    } catch (error) {
      this.logger.error('Failed to get swap rate:', error);
      throw new Error('Failed to calculate swap rate');
    }
  }

  private async sendPriceIncreaseEmail(tokenName: string, chain: string, priceIncrease: number) {
    const subject = `${tokenName.toUpperCase()} Price Alert: ${priceIncrease.toFixed(2)}% Increase`;
    const message = `The price of ${tokenName} on ${chain} has increased by ${priceIncrease.toFixed(2)}% in the last hour.`;

    try {
      await this.emailService.sendEmail('amin4udin@gmail.com', subject, message);
      this.logger.debug(`Email sent for ${tokenName} price increase`);
    } catch (error) {
      this.logger.error(`Failed to send email for ${tokenName} price increase:`, error);
    }
  }

  private async sendPriceAlertEmail(tokenName: string, chain: string, targetPrice: number, currentPrice: number, email: string) {
    const subject = `${tokenName.toUpperCase()} Price Alert Reached: $${targetPrice}`;
    const message = `The price of ${tokenName} on ${chain} has reached $${currentPrice}, which is above your alert threshold of $${targetPrice}.`;

    try {
      await this.emailService.sendEmail(email, subject, message);
      this.logger.debug(`Price alert email sent to ${email} for ${tokenName} at $${currentPrice}`);
    } catch (error) {
      this.logger.error(`Failed to send price alert email for ${tokenName}:`, error);
    }
  }

  private async getBitcoinPrice(): Promise<number> {
    try {
      const response = await this.httpService.axiosRef.get(
        `${this.coingeckoApiUrl}/simple/price`,
        {
          params: {
            ids: 'bitcoin',
            vs_currencies: 'usd',
          },
          headers: {
            'accept': 'application/json',
            'x-cg-demo-api-key': this.coingeckoApiKey,
          },
        },
      );

      const btcPriceInUSD = response.data.bitcoin.usd;
      return btcPriceInUSD;
    } catch (_) {
      throw new Error('Failed to get Bitcoin price from CoinGecko');
    }
  }
  

}
