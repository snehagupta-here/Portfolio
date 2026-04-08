export interface CreateTestimonial {
  user_id: string;
  name: string;
  description: string;
  designation?: string;
  rating: number;
  testimonial_date: string;
}

export interface UpdateTestimonial {
  name?: string;
  description?: string;
  designation?: string;
  rating?: number;
  testimonial_date?: string;
}
