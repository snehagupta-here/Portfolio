import {
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { PositionEnum } from 'src/enums';

export class AchievementDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsDateString()
  achievement_date!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsEnum(PositionEnum)
  position!: PositionEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  competition_name!: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  images?: string[];

  @IsUrl()
  @IsOptional()
  certificate_url?: string;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @IsOptional()
  @IsDateString()
  achievement_date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsEnum(PositionEnum)
  position?: PositionEnum;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  competition_name?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @IsOptional()
  @IsUrl()
  certificate_url?: string;
}

export class SearchAchievementQueryDto {
  @IsOptional()
  @IsMongoId()
  user_id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PositionEnum)
  position?: PositionEnum;

  @IsOptional()
  @IsString()
  competition_name?: string;
}
