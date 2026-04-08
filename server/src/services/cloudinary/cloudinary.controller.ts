import { Body, Controller, Post } from '@nestjs/common';

import { GenerateSignedUploadDto } from 'src/dto/cloudinary.dto';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('signed-uploads')
  generateSignedUploads(@Body() body: GenerateSignedUploadDto) {
    return this.cloudinaryService.generateSignedUploadUrls(
      body.folder,
      body.count,
      body.resourceType as 'image' | 'raw' | 'video' | 'auto' | undefined,
    );
  }
}
