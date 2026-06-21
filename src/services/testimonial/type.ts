export type TestimonialApiImage = {
  publicId?: string;
  public_id?: string;
  secureUrl?: string;
  secure_url?: string;
  url?: string;
  src?: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  resource_type?: string;
  bytes?: number;
  originalFilename?: string;
  original_filename?: string;
  alt?: string;
  caption?: string;
};

export type TestimonialApiItem = {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  designation: string;
  rating: number;
  testimonial_date: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  image?: TestimonialApiImage;
};

export type TestimonialImage = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Testimonial = {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  designation: string;
  rating: number;
  testimonial_date: string;
  createdAt: string;
  updatedAt: string;
  image?: TestimonialImage;
};

export type TestimonialResponse = {
  success: boolean;
  data: TestimonialApiItem[];
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
