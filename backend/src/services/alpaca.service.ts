import { Injectable } from "@nestjs/common";
import axios from "axios";
import { TickerList } from "../constants/tickerList.constants";
import { SnapShotReponse } from "../models/snapshotResponse";

@Injectable()
export class AlpacaService {
    readonly host = 'https://data.alpaca.markets';
    readonly price_endpoint = (ticker) => this.host + `/v2/stocks/${ticker}/bars`;
    readonly movers_endpoint = this.host + '/v2/stocks/snapshots';
    readonly new_endpoint = this.host + '/v1beta1/news';

    readonly headers = {
        "Apca-Api-Key-Id" : "PKJFVW6692N7B0J3CEBY",
        "Apca-Api-Secret-Key" : "uzsDIdhMYFJH5R8Msk0ka4nGFyMLDlgpan7NSMtv"
    }

    private getCentralTimeOffset(date) {
        const march = new Date(date.getFullYear(), 2, 14); // March 14th - always past the second Sunday
        const november = new Date(date.getFullYear(), 10, 7); // November 7th - always after the first Sunday
        const isDST = date >= march && date < november;
        return isDST ? -5 : -6; // Central Daylight Time is UTC-5, Central Standard Time is UTC-6
    }

    private getStartAndEndTime() {
        const now = new Date(); // Current date and time
        let startTime = new Date(now);
        let endTime = new Date(now);
    
        // Adjust to Central Time considering DST if needed
        const centralTimeOffset = this.getCentralTimeOffset(now);
        startTime.setHours(startTime.getHours() + centralTimeOffset);
        endTime.setHours(endTime.getHours() + centralTimeOffset);
    
        // Set start and end times for the business day (8:30 AM to 3:00 PM)
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        endTime.setMilliseconds(0);

        
        if (startTime.getHours() > 8 && startTime.getHours() <= 15) {
            startTime.setHours(8, 30);
            if(startTime.getDay()==0) {
                startTime.setDate(startTime.getDate()-1);
                endTime.setDate(endTime.getDate()-1);
            }
        } else if (startTime.getHours() < 8) {
            startTime.setHours(8, 30);
            startTime.setDate(startTime.getDate()-1);
            endTime.setHours(15);
            endTime.setDate(endTime.getDate()-1);
        } else {
            startTime.setHours(8, 30);
            endTime.setHours(15);
            if(startTime.getDay()==0) {
                startTime.setDate(startTime.getDate()-1);
                endTime.setDate(endTime.getDate()-1);
            }
        }
        
        if(startTime.getDay()==6) {
            startTime.setDate(startTime.getDate()-1);
            endTime.setDate(endTime.getDate()-1);
        }
    
        startTime.setHours(startTime.getHours() - centralTimeOffset);
        endTime.setHours(endTime.getHours() - centralTimeOffset);

        endTime.setMinutes(endTime.getMinutes()-15)
        return {startTime, endTime};   
    }

    async getPrice(ticker :string) {
        const {startTime , endTime} = this.getStartAndEndTime(); 
        const queryParams: Record<string, string> = {
            "start" : startTime.toISOString(),
            "end" : endTime.toISOString(),
            "timeframe" : "5Min"
        }
        const url = this.price_endpoint(ticker);
        try {
            const response = await axios.get(url, {params: queryParams, headers: this.headers});
            return response.data;
        } catch(e) {
            console.log(e?.path);
        }
    }

    async getAllSnapshots() : Promise<SnapShotReponse>{
        try {
            const url = this.movers_endpoint + '?symbols=' + Object.keys(TickerList.List).join(',');
            const response = await axios.get(url, {headers: this.headers});
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }
    
    async getNews() {
        const queryParams = {
            'sort' : 'DESC'
        }
        try {
            const response = await axios.get(this.new_endpoint, {headers: this.headers, params: queryParams});
            return response.data;
        } catch (e) {
            console.log(e)
        }
    }
}