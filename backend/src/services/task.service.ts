import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AlpacaService } from "./alpaca.service";
import { TickerList } from "../constants/tickerList.constants";
import { Stock, StockDocument } from "../models/stock.entity";

@Injectable()
export class TaskService {

    constructor(private alpacaSevice :AlpacaService,
        @InjectModel(Stock.name) private stockModel : Model<StockDocument>
        ) {}

    @Cron('16 21 * * 1-5')
    async handleCron() {
        const response = await this.alpacaSevice.getAllSnapshots();
        
        Object.keys(TickerList.List).forEach(async (ticker:string) => {
            
            const data = response[ticker]["dailyBar"];
            
            const stock = await this.createStock(data, ticker);

            console.log(stock)
        });
        
    }

    async createStock (data, ticker)  : Promise<Stock>{

        const stockDto = { _id : new Types.ObjectId()};

        stockDto['date'] = new Date(data["t"]);
        stockDto['open'] = data["o"];
        stockDto['close'] = data["c"];
        stockDto['high'] = data["h"];
        stockDto['low'] = data["l"];
        stockDto['count'] = data["n"];
        stockDto['volume'] = data["v"];
        stockDto['volume_weighted'] = data["vw"];
        stockDto['symbol'] = ticker;
        
        const stock = new this.stockModel(stockDto);
        
        return stock.save();

    }
}