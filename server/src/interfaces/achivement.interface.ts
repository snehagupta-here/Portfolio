import { PositionEnum } from 'src/enums';

export interface CreateAchievement {
  user_id: string;
  achievement_date: string;
  title: string;
  position: PositionEnum;
  description?: string;
  competition_name: string;
  images?: string[];
  certificate_url?: string;
}

export interface UpdateAchievement {
  achievement_date?: string;
  title?: string;
  position?: PositionEnum;
  description?: string;
  competition_name?: string;
  images?: string[];
  certificate_url?: string;
}
