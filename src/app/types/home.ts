export type HomeSkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Design"
  | "Mobile"
  | "DevOps"
  | "Cloud"
  | "Languages";

export type HomeSkill = {
  name: string;
  category: HomeSkillCategory;
};

export type HomeExperience = {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
};

export type HomeTestimonial = {
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
};

