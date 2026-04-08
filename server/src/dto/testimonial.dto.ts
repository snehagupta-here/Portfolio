import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsDateString,
  IsMongoId,
} from 'class-validator';

export class TestimonialDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsOptional()
  designation?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsDateString()
  testimonial_date!: string;
}
