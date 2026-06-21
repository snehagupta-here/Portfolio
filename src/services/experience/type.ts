export type ExperienceApiImage = {
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

export type ExperienceApiItem = {
  _id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  location: string;
  designation: string;
  description: string;
  responsibilities: string[];
  organization_name: string;
  organization_logo_url?: ExperienceApiImage | string | null;
  organization_url?: string;
  tech_stack: string[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type ExperienceLogo = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Experience = {
  _id: string;
  user_id: string;
  start_date: string;
  end_date: string | null;
  location: string;
  designation: string;
  description: string;
  responsibilities: string[];
  organization_name: string;
  organization_logo_url?: ExperienceLogo;
  organization_url?: string;
  tech_stack: string[];
  createdAt: string;
  updatedAt: string;
};

export type ExperienceResponse = {
  success: boolean;
  data: ExperienceApiItem[];
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
