import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import { configDefaults } from 'src/config';

export class GenerateSignedUploadDto {
  @IsString()
  @IsNotEmpty()
  folder!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(configDefaults.cloudinary.maxUploadCount)
  count!: number;

  @IsOptional()
  @IsString()
  resourceType?: string;
}

export class CloudinaryAssetDto {
  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsUrl()
  secureUrl!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  width?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @IsIn(['image', 'raw', 'video', 'auto'])
  resourceType?: 'image' | 'raw' | 'video' | 'auto';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bytes?: number;

  @IsOptional()
  @IsString()
  originalFilename?: string;
}
