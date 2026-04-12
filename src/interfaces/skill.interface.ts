import { SkillCategoryEnum } from 'src/enums';
import { CloudinaryImageAsset } from './image.interface';

export type SkillIcon = CloudinaryImageAsset;

// export interface CreateSkill {
//   name: string;
//   icon?: SkillIcon;
//   category: SkillCategoryEnum;
// }

export interface UpdateSkill {
  name?: string;
  icon?: SkillIcon;
  category?: SkillCategoryEnum;
}

export interface SkillResponse {
  _id: string;
  name: string;
  icon?: CloudinaryImageAsset;
  category: SkillCategoryEnum;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResolvedSkillInput {
  name: string;
  category: SkillCategoryEnum;
  icon: SkillIcon;
}
