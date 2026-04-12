import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SkillCategoryEnum } from 'src/enums';
import { CloudinaryAssetDto } from './cloudinary.dto';

export class SkillDto {
  @IsString()
  name!: string;

  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  icon!: CloudinaryAssetDto;

  @IsEnum(SkillCategoryEnum)
  category!: SkillCategoryEnum;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  icon?: CloudinaryAssetDto;

  @IsOptional()
  @IsEnum(SkillCategoryEnum)
  category?: SkillCategoryEnum;
}

export class SearchSkillQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(SkillCategoryEnum)
  category?: SkillCategoryEnum;
}
