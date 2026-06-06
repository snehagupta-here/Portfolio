import type { ImageAsset } from "./media";

export enum PositionEnum {
  FIRST = "1st Place",
  SECOND = "2nd Place",
  THIRD = "3rd Place",
  WINNER = "Winner",
  RUNNER_UP = "Runner Up",
  FINALIST = "Finalist",
  PARTICIPANT = "Participant",
  HONORABLE_MENTION = "Honorable Mention",
}

export type DetailedAchievement = {
  _id: string;
  user_id: string;
  achievement_date: string;
  title: string;
  position: PositionEnum;
  description: string;
  competition_name: string;
  images: ImageAsset[];
  certificate_url?: ImageAsset;
  createdAt: string;
  updatedAt: string;
};

