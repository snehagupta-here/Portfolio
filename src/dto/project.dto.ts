import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ProjectCodeSnippetDto {
  @IsOptional()
  @IsString()
  filename?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  description?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  code?: string[];
}

class ProjectImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  alt?: string;

  @IsOptional()
  @IsString()
  caption?: string;
}

class ProjectQuestionDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;
}

class ProjectContentPointDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class ProjectContentItemDto {
  @IsOptional()
  @IsString()
  subHeading?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paragraphs?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  points?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectCodeSnippetDto)
  codeSnippets?: ProjectCodeSnippetDto[];
}

class ProjectContentSectionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  paragraphs?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectCodeSnippetDto)
  codeSnippets?: ProjectCodeSnippetDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectContentItemDto)
  items?: ProjectContentItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectContentPointDto)
  points?: ProjectContentPointDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  images?: ProjectImageDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectQuestionDto)
  questions?: ProjectQuestionDto[];
}

class ProjectMetaDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  projectType?: string[];

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  estimatedReadTime?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @IsOptional()
  @IsString()
  duration?: string;
}

class ProjectThumbnailDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  alt?: string;
}

class ProjectFutureImprovementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

class ProjectRepositoryDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  branch?: string;

  @IsOptional()
  @IsString()
  visibility?: string;
}

class ProjectAuthorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  github?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;
}

class ProjectMetadataDto {
  @IsOptional()
  @IsString()
  status?: string;

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
  @IsBoolean()
  trending?: boolean;

  @IsOptional()
  @IsNumber()
  readTime?: number;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsNumber()
  likes?: number;
}

class ProjectSeoDto {
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

export class ProjectDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectMetaDto)
  meta?: ProjectMetaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectThumbnailDto)
  thumbnail?: ProjectThumbnailDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectContentSectionDto)
  content?: ProjectContentSectionDto[];

  @IsOptional()
  @IsObject()
  database?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  apis?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  performance?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  testing?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  folderStructure?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pages?: Record<string, unknown>[];

  @IsOptional()
  @IsObject()
  cicd?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deployment?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  environmentVariables?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectFutureImprovementDto)
  futureImprovements?: ProjectFutureImprovementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectRepositoryDto)
  repository?: ProjectRepositoryDto[];

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectAuthorDto)
  author?: ProjectAuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectMetadataDto)
  metadata?: ProjectMetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectSeoDto)
  seo?: ProjectSeoDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  tagline?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectMetaDto)
  meta?: ProjectMetaDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectThumbnailDto)
  thumbnail?: ProjectThumbnailDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectContentSectionDto)
  content?: ProjectContentSectionDto[];

  @IsOptional()
  @IsObject()
  database?: Record<string, unknown>;

  @IsOptional()
  @IsObject()
  apis?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  performance?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  testing?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  folderStructure?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  pages?: Record<string, unknown>[];

  @IsOptional()
  @IsObject()
  cicd?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  deployment?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  environmentVariables?: Record<string, unknown>[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectFutureImprovementDto)
  futureImprovements?: ProjectFutureImprovementDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectRepositoryDto)
  repository?: ProjectRepositoryDto[];

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectAuthorDto)
  author?: ProjectAuthorDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectMetadataDto)
  metadata?: ProjectMetadataDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProjectSeoDto)
  seo?: ProjectSeoDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SearchProjectQueryDto {
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
