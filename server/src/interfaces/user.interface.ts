export interface SocialLink {
  name: string;
  icon?: string;
  url: string;
}

export interface UserSkill {
  skill_id: string;
  yoe: number;
  scale: number;
}

export interface UserCreate {
  about?: string;
  resume?: string;
  links?: SocialLink[];
  skills?: UserSkill[];
}

export interface UserUpdate {
  about?: string;
  resume?: string;
  links?: SocialLink[];
  skills?: UserSkill[];
}