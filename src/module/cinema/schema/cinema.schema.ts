import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CinemaPremier } from './cinema-premier.schema';

export type CinemaDocument = Cinema & Document;

@Schema({ toObject: { getters: true }, versionKey: false })
export class Cinema {
  @Prop({ required: true })
  name: String;

  @Prop({ required: true })
  cinemaPremieres: [CinemaPremier];

  @Prop({ required: true })
  cinemaRooms: [
    {
      name: Number;
      capacity: Number;
      format: String;
      schedules: [
        {
          time: String;
          seatsEmpty: [Number];
          seatsOccupied: [Number];
          movie_id: [String];
          price: Number;
        },
      ];
    },
  ];

  @Prop({ required: true })
  city_id: String;
}

export const CinemaSchema = SchemaFactory.createForClass(Cinema);
