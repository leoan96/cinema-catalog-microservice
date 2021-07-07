import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({ toObject: { getters: true }, versionKey: false })
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  runtime: number;

  @Prop({ enum: ['IMAX'] })
  format: string;

  @Prop({ required: true })
  plot: string;

  @Prop({ required: true })
  releaseYear: number;

  @Prop({ required: true })
  releaseMonth: number;

  @Prop({ required: true })
  releaseDat: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
