import { ConfigService } from '@nestjs/config';

export const MongooseClient = {
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get<string>('mongoose.uri'),
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    createIndexes: false,
  }),
  inject: [ConfigService],
};
