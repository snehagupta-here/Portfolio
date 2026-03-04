import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactUs, ContactUsSchema } from 'src/schema/contact-us.schema';
import { ContactUsController } from './contact-us.controller';
import { ContactUsService } from './contact-us.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ContactUs.name, schema: ContactUsSchema }],
      'db',
    ),
  ],
  controllers: [ContactUsController],
  providers: [ContactUsService],
  exports: [ContactUsService],
})
export class ContactUsModule {}