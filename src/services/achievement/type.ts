export type AchievementImage = {
  url: string;
  alt: string;
  caption?: string;
};

export type AchievementApiImage =
  | string
  | {
      url?: string;
      src?: string;
      secureUrl?: string;
      secure_url?: string;
      alt?: string;
      caption?: string;
      originalFilename?: string;
      original_filename?: string;
      publicId?: string;
      public_id?: string;
      width?: number;
      height?: number;
      format?: string;
      resourceType?: string;
      resource_type?: string;
      bytes?: number;
    };

export type AchievementApiItem = {
  _id: string;
  user_id: string;
  achievement_date: string;
  title: string;
  position: string;
  description: string;
  competition_name: string;
  images: AchievementApiImage[];
  certificate_url?: string | AchievementApiImage;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type Achievement = {
  _id: string;
  user_id: string;
  achievement_date: string;
  title: string;
  position: string;
  description: string;
  competition_name: string;
  images: AchievementImage[];
  certificate_url?: string;
  createdAt: string;
  updatedAt: string;
};

export type AchievementResponse = {
  success: boolean;
  data: AchievementApiItem[];
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
