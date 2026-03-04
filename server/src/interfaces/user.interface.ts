export interface SocialLink {
  name: string;
  icon?: string;
  url: string;
}

export interface UserCreate {
  about?: string;
  resume?: string;
  links?: SocialLink[];
  skills?: string[];
}

export interface UserUpdate {
  about?: string;
  resume?: string;
  links?: SocialLink[];
  skills?: string[];
}