import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { CloudinaryAssetDto } from './cloudinary.dto';

export class ExperienceDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsDateString()
  start_date!: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsNotEmpty()
  designation!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsString()
  @IsNotEmpty()
  organization_name!: string;

  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  organization_logo_url!: CloudinaryAssetDto;

  @IsOptional()
  @IsUrl()
  organization_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsString()
  organization_name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  organization_logo_url?: CloudinaryAssetDto;

  @IsOptional()
  @IsUrl()
  organization_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];
}

export class SearchExperienceQueryDto {
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  organization_name?: string;
}
