import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CloudinaryAssetDto } from './cloudinary.dto';

class SocialLinkDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsUrl()
  url!: string;
}

class UserSkillDto {
  @IsMongoId()
  skill_id!: string;

  @IsNumber()
  @Min(0)
  yoe!: number;

  @IsInt()
  @Min(0)
  @Max(10)
  scale!: number;
}

export class UserDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  links?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDto)
  skills?: UserSkillDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  profile_image?: CloudinaryAssetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  resume?: CloudinaryAssetDto;
}

export class SearchUserQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsMongoId()
  skill_id?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  links?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSkillDto)
  skills?: UserSkillDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  profile_image?: CloudinaryAssetDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CloudinaryAssetDto)
  resume?: CloudinaryAssetDto;
}
