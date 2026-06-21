export type HomeSkillCategory =
  | "Frontend"
  | "Backend"
  | "Database"
  | "Design"
  | "Mobile"
  | "DevOps"
  | "Cloud"
  | "Languages"
  | "Other";

export type HomeSkill = {
  id: string;
  name: string;
  category: HomeSkillCategory;
  iconUrl?: string;
  iconAlt?: string;
  yearsOfExperience?: number;
  scale?: number;
};
