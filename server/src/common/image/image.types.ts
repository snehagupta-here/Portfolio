import { UploadApiResponse } from 'cloudinary';
import { SkillCategoryEnum } from 'src/enums';
export type ImageSourceType = 'file' | 'url';

export interface CloudinaryImageAsset {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
  originalFilename?: string;
}

export interface ImageValidationOptions {
  allowedMimeTypes?: string[];
  maxSizeBytes?: number;
  allowedProtocols?: string[];
  allowSvg?: boolean;
  allowedDomains?: string[];
  blockedDomains?: string[];
}

export interface ResolveImageInput {
  file?: Express.Multer.File;
  url?: string;
}

export interface ResolveImageOptions extends ImageValidationOptions {
  folder: string;
  publicId?: string;
  overwrite?: boolean;
}

export interface ResolvedImageResult {
  sourceType: ImageSourceType;
  asset: CloudinaryImageAsset;
  raw: UploadApiResponse;
}

export interface ResolvedSkillInput {
  name: string;
  category: SkillCategoryEnum;
  icon: {
    sourceType: 'file' | 'url';
    file?: Express.Multer.File;
    url?: string;
  };
}

export interface ResolvedExperienceInput {
  user_id: string;
  start_date: string;
  end_date?: string;
  location?: string;
  designation: string;
  description?: string;
  responsibilities?: string[];
  organization_name: string;
  organization_logo_url?: {
    sourceType: 'file' | 'url';
    file?: Express.Multer.File;
    url?: string;
  };
  organization_url?: string;
  tech_stack?: string[];
}
