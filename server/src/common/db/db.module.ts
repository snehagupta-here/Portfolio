import { Global, Module } from '@nestjs/common';

import { AppLoggerModule } from '../app-logger.module';
import { MongoModule } from './mongo.module';

@Global()
@Module({
  imports: [AppLoggerModule, MongoModule],
  exports: [AppLoggerModule, MongoModule],
})
export class DbModule {}
