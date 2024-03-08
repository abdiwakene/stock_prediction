import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AppModule } from '../src/app.module';
import { AppController } from '../src/app.controller';
import { QstockMapper } from '../src/mappers/qstock.mapper';
import { AlpacaService } from '../src/services/alpaca.service';
import { AppService } from '../src/services/app.service';
import { TickerList } from '../src/constants/tickerList.constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let alpacaService = new AlpacaService();
  let mock = new MockAdapter(axios);

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TickerList],
      controllers: [AppController],
      providers: [AppService, AlpacaService, QstockMapper],
    })
    .overrideProvider(AlpacaService)
    .useValue(alpacaService)
    .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET qstock/getPrice', () => {
    const ticker = 'AAPL';
    const mockResponse = {
      "bars": [
        {
          "c": 186.86,
          "h": 186.95,
          "l": 183.82,
          "n": 820977,
          "o": 183.985,
          "t": "2024-02-01T05:00:00Z",
          "v": 64885408,
          "vw": 185.568846
        },
        {
          "c": 185.85,
          "h": 187.33,
          "l": 179.25,
          "n": 1107347,
          "o": 179.86,
          "t": "2024-02-02T05:00:00Z",
          "v": 102519103,
          "vw": 184.74328
        }
      ],
      "next_page_token": null,
      "symbol": "AAPL"
    };

    mock.onGet(new RegExp(`${alpacaService.host}/v2/stocks/${ticker}/bars\*`)).reply(200, mockResponse);

    return request(app.getHttpServer())
      .get(`/qstock/getPrice?ticker=${ticker}`)
      .expect(200)
      .expect(mockResponse);
  });

  it(`/GET qstock/getNews`, () => {
    const ticker = 'TSLA';
    const mockResponse = [
      { title: "Tesla's New Model", date: '2023-03-03', description: "Tesla releases a new model that's more affordable." },
      { title: 'Tesla Stock Surges', date: '2023-03-02', description: 'Tesla stock price increases due to high demand.' }
    ];
  
    mock.onGet(new RegExp(`${alpacaService.host}/v1beta1\/news$/`)).reply(200, mockResponse);
  
    return request(app.getHttpServer())
      .get(`/qstock/getNews?ticker=${ticker}`)
      .expect(200)
  });

  it(`/GET qstock/getTopMovers`, () => {
    const mockResponse = {
      "TSLA": {
        "dailyBar": {
          "c": 202.6,
          "h": 204.43,
          "l": 198.5,
          "n": 5348,
          "o": 200.53,
          "t": "2024-03-01T05:00:00Z",
          "v": 389014,
          "vw": 201.715971
        },
        "latestQuote": {
          "ap": 202.7,
          "as": 4,
          "ax": "V",
          "bp": 202.6,
          "bs": 4,
          "bx": "V",
          "c": [
            "R"
          ],
          "t": "2024-03-01T20:59:59.919960444Z",
          "z": "C"
        },
        "latestTrade": {
          "c": [
            "@"
          ],
          "i": 5348,
          "p": 202.6,
          "s": 200,
          "t": "2024-03-01T20:59:59.898916826Z",
          "x": "V",
          "z": "C"
        },
        "minuteBar": {
          "c": 202.6,
          "h": 202.71,
          "l": 202.51,
          "n": 196,
          "o": 202.56,
          "t": "2024-03-01T20:59:00Z",
          "v": 11655,
          "vw": 202.61365
        },
        "prevDailyBar": {
          "c": 201.81,
          "h": 205.26,
          "l": 198.5,
          "n": 5803,
          "o": 204.13,
          "t": "2024-02-29T05:00:00Z",
          "v": 390956,
          "vw": 201.238473
        }
      },
      "AAPL": {
        "dailyBar": {
          "c": 179.64,
          "h": 180.48,
          "l": 177.38,
          "n": 12651,
          "o": 179.66,
          "t": "2024-03-01T05:00:00Z",
          "v": 1182815,
          "vw": 178.933405
        },
        "latestQuote": {
          "ap": 179.65,
          "as": 2,
          "ax": "V",
          "bp": 177.3,
          "bs": 1,
          "bx": "V",
          "c": [
            "R"
          ],
          "t": "2024-03-01T20:59:59.998501154Z",
          "z": "C"
        },
        "latestTrade": {
          "c": [
            "@"
          ],
          "i": 12651,
          "p": 179.64,
          "s": 200,
          "t": "2024-03-01T20:59:59.899108033Z",
          "x": "V",
          "z": "C"
        },
        "minuteBar": {
          "c": 179.64,
          "h": 179.7,
          "l": 179.565,
          "n": 263,
          "o": 179.7,
          "t": "2024-03-01T20:59:00Z",
          "v": 27007,
          "vw": 179.645465
        },
        "prevDailyBar": {
          "c": 180.73,
          "h": 182.54,
          "l": 179.56,
          "n": 13951,
          "o": 181.32,
          "t": "2024-02-29T05:00:00Z",
          "v": 1344358,
          "vw": 180.612131
        }
      }
    };
  
    mock.onGet(new RegExp(`${alpacaService.host}/v2/stocks/snapshots\/`)).reply(200, mockResponse);
  
    return request(app.getHttpServer())
      .get(`/qstock/getTopMovers`)
      .expect(200);
  });
  
});
