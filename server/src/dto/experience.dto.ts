import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsDateString,
  IsArray,
  IsUrl,
} from 'class-validator';

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

  @IsOptional()
  @IsUrl()
  organization_logo_url?: string;

  @IsOptional()
  @IsUrl()
  organization_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech_stack?: string[];
}