import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CloudinaryAssetDto } from './cloudinary.dto';
import { IsImageAssetOrStringConstraint } from './image-asset-or-string.validator';
import { SectionTypeEnum, ContentTypeEnum } from 'src/enums';

class CodeSnippetDto {
  @IsString()
  language!: string;

  @IsString()
  code!: string;
}

class FAQDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;
}

class SubItemDto {
  @IsString()
  subHeading!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  points?: string[];

  @IsOptional()
  @IsArray()
  @Validate(IsImageAssetOrStringConstraint, { each: true })
  images?: Array<CloudinaryAssetDto | string>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CodeSnippetDto)
  codeSnippet?: CodeSnippetDto[];
}

class ContentSectionDto {
  @IsString()
  id!: string;

  @IsEnum(ContentTypeEnum)
  contentType!: ContentTypeEnum;

  @IsEnum(SectionTypeEnum)
  type!: SectionTypeEnum;

  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  points?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubItemDto)
  items?: SubItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FAQDto)
  questions?: FAQDto[];

  @IsOptional()
  @IsArray()
  @Validate(IsImageAssetOrStringConstraint, { each: true })
  images?: Array<CloudinaryAssetDto | string>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CodeSnippetDto)
  codeSnippet?: CodeSnippetDto[];
}

class MediaDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @Validate(IsImageAssetOrStringConstraint)
  thumbnail?: CloudinaryAssetDto | string;
}

class AuthorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Validate(IsImageAssetOrStringConstraint)
  avatar?: CloudinaryAssetDto | string;
}

class MetadataDto {
  @IsOptional()
  @IsDateString()
  publishedDate?: string;

  @IsOptional()
  @IsDateString()
  lastModified?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  readTime?: number;
}

class SEODto {
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
}

export class BlogDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @IsOptional()
  @Validate(IsImageAssetOrStringConstraint)
  thumbnail?: CloudinaryAssetDto | string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SEODto)
  seo?: SEODto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentSectionDto)
  content?: ContentSectionDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MediaDto)
  media?: MediaDto;

  @IsOptional()
  @Validate(IsImageAssetOrStringConstraint)
  thumbnail?: CloudinaryAssetDto | string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AuthorDto)
  author?: AuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => SEODto)
  seo?: SEODto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SearchBlogQueryDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  isActive?: string;
}

export class BlogUserParamDto {
  @IsMongoId({
    message: 'user: user must be a valid',
  })
  @IsNotEmpty({ message: 'user: user is required' })
  user_id!: string;
}

export class BlogScopedIdParamDto extends BlogUserParamDto {
  @IsMongoId({
    message: 'id: id must be a valid',
  })
  @IsNotEmpty({ message: 'id: id is required' })
  id!: string;
}
