import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SkillCategoryEnum } from 'src/enums';
import { CloudinaryAssetDto } from './cloudinary.dto';

export class SkillDto {
  @IsString({ message: 'name: name must be a string' })
  @IsNotEmpty({ message: 'name: name is required' })
  name!: string;

  @IsDefined({ message: 'icon: icon is required' })
  @ValidateNested({ message: 'icon: icon must be a valid object' })
  @Type(() => CloudinaryAssetDto)
  icon!: CloudinaryAssetDto;

  @IsDefined({ message: 'category: category is required' })
  @IsEnum(SkillCategoryEnum, {
    message:
      'category: category must be one of frontend, language, backend, database, cloud, devops, design, other',
  })
  category!: SkillCategoryEnum;
}

export class UpdateSkillDto {
  @IsOptional()
  @IsString({ message: 'name: name must be a string' })
  name?: string;

  @IsOptional()
  @ValidateNested({ message: 'icon: icon must be a valid' })
  @Type(() => CloudinaryAssetDto)
  icon?: CloudinaryAssetDto;

  @IsOptional()
  @IsEnum(SkillCategoryEnum, {
    message:
      'category: category must be one of frontend, language, backend, database, cloud, devops, design, other',
  })
  category?: SkillCategoryEnum;
}

export class SearchSkillQueryDto {
  @IsOptional()
  @IsString({ message: 'name: name must be a string' })
  name?: string;

  @IsOptional()
  @IsEnum(SkillCategoryEnum, {
    message:
      'category: category must be one of frontend, language, backend, database, cloud, devops, design, other',
  })
  category?: SkillCategoryEnum;
}
