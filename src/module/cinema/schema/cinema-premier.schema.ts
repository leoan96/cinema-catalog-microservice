import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CinemaPremierDocument = CinemaPremier & Document;

@Schema({ toObject: { getters: true }, versionKey: false })
export class CinemaPremier {
  @Prop({ required: true })
  id: String;

  @Prop({ required: true })
  title: String;

  @Prop({ required: true })
  runtime: Number;

  @Prop({ required: true })
  plot: String;

  @Prop({ required: true })
  poster: String;
}

export const CinemaPremierSchema = SchemaFactory.createForClass(CinemaPremier);
