import { Global, Module } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { MongoService } from './mongo.service';

const mongoConnectionProvider = {
  provide: getConnectionToken(),
  useFactory: () => mongoose.createConnection(),
};

@Global()
@Module({
  providers: [mongoConnectionProvider, MongoService],
  exports: [mongoConnectionProvider, MongoService],
})
export class MongoModule {}
