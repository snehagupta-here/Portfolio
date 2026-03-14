import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const cloudName = 'dz1t0hml1';
    const apiKey = '227158558551417';
    const apiSecret = 'bsJGZQ8KfCZEgoVcx5dIJBt4MBA';

    console.log('Cloudinary provider loaded:', {
      cloudName,
      hasApiKey: !!apiKey,
      hasApiSecret: !!apiSecret,
    });

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    console.log('Cloudinary runtime config:', cloudinary.config());

    return cloudinary;
  },
};