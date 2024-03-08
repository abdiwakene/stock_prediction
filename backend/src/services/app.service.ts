import { Injectable } from '@nestjs/common';
import { AlpacaService } from './alpaca.service';
import { QstockMapper } from '../mappers/qstock.mapper';
import { TickerList } from '../constants/tickerList.constants';

@Injectable()
export class AppService {

    constructor(private alpacaService: AlpacaService,
        private qstockMapper :QstockMapper) {}
   
    async getHistoricalDataByTicker(ticker :string) : Promise<any> {
      const response = await this.alpacaService.getPrice(ticker) || {};
      response['name'] = TickerList.List[ticker]?.name;
      response['sector'] = TickerList.List[ticker]?.sector;
      return response
    }

    async getTopMovers() {
      const response = await this.alpacaService.getAllSnapshots();
      let parsedData = this.qstockMapper.mapTopMovers(response);
      parsedData = parsedData.sort(this.absoluteValueComparison).slice(0,10);
      return parsedData
    }

    async getNews() { 
      return await this.alpacaService.getNews();
    }

    private absoluteValueComparison(b, a) {
        //sort integers by absolute value
      if(Math.abs(a.p) < Math.abs(b.p)) {
        return -1
      } else if(Math.abs(a.p) > Math.abs(b.p)) {
        return 1;
      //sort identical absolute values in numerical order
      } else if(a.p < b.p) {
        return -1;
      } else if(a.p > b.p) {
        return 1;
      } else {
        return 0;
      }
    }
}
