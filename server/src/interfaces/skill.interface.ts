import { SkillCategoryEnum } from 'src/enums';

export interface CreateSkill {
  user_id: string;
  name: string;
  icon?: string;
  scale: number;
  yoe?: number;
  category: SkillCategoryEnum;
}

export interface UpdateSkill {
  name?: string;
  icon?: string;
  scale?: number;
  yoe?: number;
  category?: SkillCategoryEnum;
}