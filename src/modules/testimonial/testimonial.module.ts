import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Testimonial, TestimonialSchema } from 'src/schema/testimonial.schema';
import { User, UserSchema } from 'src/schema/user.schema';

import { TestimonialController } from './testimonial.controller';
import { TestimonialService } from './testimonial.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Testimonial.name, schema: TestimonialSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
  exports: [TestimonialService],
})
export class TestimonialModule {}
