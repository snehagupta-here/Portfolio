import {
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
} from 'class-validator';
import { SkillCategoryEnum } from 'src/enums';

export class SkillDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsEnum(SkillCategoryEnum)
  category!: SkillCategoryEnum;
}
