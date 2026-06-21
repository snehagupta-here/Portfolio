export type UserAsset = {
  fileName?: string;
  url?: string;
  publicId?: string;
  secureUrl?: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
  originalFilename?: string;
};

export type UserHighlight = {
  title: string;
  description: string;
};

export type UserSocialLink = {
  name: string;
  icon: string;
  url: string;
};

export type UserSkillAsset = {
  publicId?: string;
  secureUrl?: string;
  url?: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  bytes?: number;
  originalFilename?: string;
};

export type UserSkillDefinition = {
  _id: string;
  name: string;
  category: string;
  icon?: UserSkillAsset;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type UserSkill = {
  skill_id: UserSkillDefinition;
  yoe?: number;
  scale?: number;
};

export type UserProfile = {
  _id: string;
  name: string;
  email: string;
  paragraphs: string[];
  highlights: UserHighlight[];
  socialLinks: UserSocialLink[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
  aboutBio?: string;
  aboutHeading?: string;
  avatar?: UserAsset;
  bio?: string;
  location?: string;
  projectsCompleted?: string;
  resume?: UserAsset;
  tagline?: string;
  title?: string;
  totalYearsExperience?: string;
  skills?: UserSkill[];
};

export type UserResponse = {
  success: boolean;
  data: UserProfile;
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};

export type GitHubContributionDay = {
  date: string;
  contributionCount: number;
  color: string;
  weekday: number;
};

export type GitHubContributionWeek = {
  contributionDays: GitHubContributionDay[];
};

export type GitHubContributions = {
  year: number;
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  weeks: GitHubContributionWeek[];
};

export type GitHubContributionsResponse = {
  success: boolean;
  data: GitHubContributions;
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
