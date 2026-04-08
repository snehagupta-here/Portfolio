import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ContactUsSubmissionFailedException } from 'src/exceptions/contact-us.exceptions';
import { ContactUsBody } from '../../interfaces';
import { ContactUs } from '../../schema/contact-us.schema';

@Injectable()
export class ContactUsService {
  constructor(
    @InjectModel(ContactUs.name)
    private readonly contactUsCollection: Model<ContactUs>,
  ) {}

  async contactUs(body: ContactUsBody) {
    try {
      await this.contactUsCollection.create({ ...body });

      return {
        success: true,
        data: {},
        message:
          'Thankyou for contacting, our team will reach out to you soon.',
      };
    } catch (e: unknown) {
      throw new ContactUsSubmissionFailedException(
        e instanceof Error ? e.message : undefined,
      );
    }
  }
}
