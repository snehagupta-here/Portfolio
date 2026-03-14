import { ConfigService } from '@nestjs/config';

export default () => {
  const configService = new ConfigService();

  const dbUrl = configService.get<string>('DB_URL');
  const cloudinaryCloudName = configService.get<string>('CLOUDINARY_CLOUD_NAME');
  const cloudinaryApiKey = configService.get<string>('CLOUDINARY_API_KEY');
  const cloudinaryApiSecret = configService.get<string>('CLOUDINARY_API_SECRET');

  return {
    dbUrl,
    cloudinary: {
      cloudName: cloudinaryCloudName,
      cloudApiKey: cloudinaryApiKey,
      cloudSecret: cloudinaryApiSecret,
    },
  };
};