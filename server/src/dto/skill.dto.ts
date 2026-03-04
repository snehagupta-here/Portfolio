import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { SkillCategoryEnum } from 'src/enums';

export class SkillDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsInt()
  @Min(0)
  @Max(10)
  scale!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yoe?: number;

  @IsEnum(SkillCategoryEnum)
  category!: SkillCategoryEnum;
}