import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

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
  meta?: any;

  @IsOptional()
  thumbnail?: any;

  @IsOptional()
  @IsArray()
  content?: any[];

  @IsOptional()
  database?: any;

  @IsOptional()
  apis?: any;

  @IsOptional()
  @IsArray()
  performance?: any[];

  @IsOptional()
  @IsArray()
  testing?: any[];

  @IsOptional()
  @IsArray()
  folderStructure?: any[];

  @IsOptional()
  @IsArray()
  pages?: any[];

  @IsOptional()
  cicd?: any;

  @IsOptional()
  @IsArray()
  deployment?: any[];

  @IsOptional()
  @IsArray()
  environmentVariables?: any[];

  @IsOptional()
  futureImprovements?: any[];

  @IsOptional()
  repository?: any[];

  @IsOptional()
  @IsString()
  liveUrl?: string;

  @IsOptional()
  author?: any;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  seo?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}