import { CloudinaryImageAsset } from 'src/interfaces/image.interface';

export interface CreateExperience {
  user_id: string;
  start_date: string;
  end_date?: string;
  location?: string;
  designation: string;
  description?: string;
  responsibilities?: string[];
  organization_name: string;
  organization_logo_url?: CloudinaryImageAsset;
  organization_url?: string;
  tech_stack?: string[];
}

export interface UpdateExperience {
  start_date?: string;
  end_date?: string;
  location?: string;
  designation?: string;
  description?: string;
  responsibilities?: string[];
  organization_name?: string;
  organization_logo_url?: CloudinaryImageAsset;
  organization_url?: string;
  tech_stack?: string[];
}

export interface ResolvedExperienceInput {
  user_id: string;
  start_date: string;
  end_date?: string;
  location?: string;
  designation: string;
  description?: string;
  responsibilities?: string[];
  organization_name: string;
  organization_logo_url?: CloudinaryImageAsset;
  organization_url?: string;
  tech_stack?: string[];
}
