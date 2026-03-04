import {
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsUrl,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinkDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsUrl()
  url!: string;
}

export class UserDto {
  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsUrl()
  resume?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  links?: SocialLinkDto[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  skills?: string[];
}