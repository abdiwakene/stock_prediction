import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { AlpacaService } from './services/alpaca.service';
import { TaskService } from './services/task.service';
import { QstockMapper } from './mappers/qstock.mapper';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, StockSchema } from './models/stock.entity';

@Module({
  imports: [ScheduleModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://api:apipassword123@stonks.rhtscww.mongodb.net/stonks?retryWrites=true&w=majority', {}),
    MongooseModule.forFeature([{schema: StockSchema, name: Stock.name}])
  ],
  controllers: [AppController],
  providers: [TaskService, AppService, AlpacaService, QstockMapper],
})
export class AppModule {}
