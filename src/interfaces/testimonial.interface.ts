import { CloudinaryImageAsset } from './image.interface';

export interface CreateTestimonial {
  name: string;
  description: string;
  designation?: string;
  image?: CloudinaryImageAsset;
  rating: number;
  testimonial_date: string;
}

export interface UpdateTestimonial {
  name?: string;
  description?: string;
  designation?: string;
  image?: CloudinaryImageAsset;
  rating?: number;
  testimonial_date?: string;
}
