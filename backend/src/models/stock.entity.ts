import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StockDocument = Stock & Document;

@Schema({collection : 'historical_stocks'})
export class Stock {

  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: Number })
  open: number;

  @Prop({ type: Number })
  count: number;

  @Prop({ type: Number })
  volume_weighted: number;

  @Prop({ type: Number })
  close: number;

  @Prop({ type: Number })
  low: number;

  @Prop({ type: Number })
  high: number;

  @Prop({ type: Number })
  volume: number;

  @Prop({ required: true })
  symbol: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);
