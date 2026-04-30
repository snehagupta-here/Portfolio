import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CloudinaryAssetDto } from './cloudinary.dto';

export class TestimonialDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @ValidateNested({ message: 'image: image must be a valid object' })
  @Type(() => CloudinaryAssetDto)
  image?: CloudinaryAssetDto;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsDateString()
  testimonial_date!: string;
}

export class UpdateTestimonialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @ValidateNested({ message: 'image: image must be a valid object' })
  @Type(() => CloudinaryAssetDto)
  image?: CloudinaryAssetDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsDateString()
  testimonial_date?: string;
}

export class TestimonialUserParamDto {
  @IsMongoId({
    message: 'user_id: user_id must be a valid',
  })
  @IsNotEmpty({ message: 'user_id: user_id is required' })
  user_id!: string;
}

export class TestimonialScopedIdParamDto extends TestimonialUserParamDto {
  @IsMongoId({
    message: 'id: id must be a valid',
  })
  @IsNotEmpty({ message: 'id: id is required' })
  id!: string;
}

export class SearchTestimonialQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;
}
