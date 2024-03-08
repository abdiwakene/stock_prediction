import { Injectable } from "@nestjs/common";
import { TickerList } from "../constants/tickerList.constants";
import { SnapShotReponse } from "../models/snapshotResponse";

@Injectable()
export class QstockMapper {

    public mapTopMovers(response: SnapShotReponse) { 
        const parsedData = []
        for (const[key, value] of Object.entries(response)) {
            const data = {};

            data['ticker'] = key;
            data['name'] = TickerList.List[key]?.name;
            data['c'] = value?.dailyBar?.c; 
            data['o'] = value?.dailyBar?.o;
            data['l'] = value?.dailyBar?.l;
            data['h'] = value?.dailyBar?.c;
            data['v'] = value?.dailyBar?.v;
            data['vw'] = value?.dailyBar?.vw;
            data['pc'] = value?.prevDailyBar?.c
            data['p'] = (data['c'] - data['pc']) / data['pc'] * 100;

            parsedData.push(data);
        }
        return parsedData;
    }
}