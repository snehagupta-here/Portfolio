import { PositionEnum } from 'src/enums';
import { ImageAsset } from 'src/schema/image-asset.schema';

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
  user_id?: string;
  achievement_date?: string;
  title?: string;
  position?: PositionEnum;
  description?: string;
  competition_name?: string;
  images?: ImageAsset[];
  certificate_url?: ImageAsset;
}
