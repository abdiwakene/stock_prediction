import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './services/app.service';

@Controller('qstock')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('getPrice')
  async getDayPrice(@Query('ticker') ticker :string): Promise<any> {
    console.log(`Request intiated for ${ticker} at ${new Date()}`)
    const response = await this.appService.getHistoricalDataByTicker(ticker);
    console.log(`Response with ${response?.bars?.length || 0} for ${ticker} at ${new Date()}`)
    return response
  }
  
  @Get('getNews')
  async getNews(@Query('ticker') ticker :string) :Promise<any> {
    return await this.appService.getNews();   
  }

  @Get('getTopMovers')
  async getTopMovers() {
    return this.appService.getTopMovers();
  }
}
