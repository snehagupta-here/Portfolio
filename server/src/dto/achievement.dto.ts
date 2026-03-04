import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsMongoId,
  IsDateString,
  IsEnum,
  IsArray,
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