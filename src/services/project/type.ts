import type {
  CICD,
  ContentSection,
  DeploymentItem,
  EnvVariableGroup,
  FutureImprovement,
  RichProject,
} from "@/app/data/richProjectData";

export type ProjectApiImage = {
  url?: string;
  secureUrl?: string;
  secure_url?: string;
  src?: string;
  alt?: string;
  caption?: string;
  originalFilename?: string;
  original_filename?: string;
};

export type ProjectApiContentPoint = {
  label?: string;
  description?: string;
};

export type ProjectApiSubItem = {
  subHeading: string;
  paragraphs?: string[];
  points?: string[];
  images?: ProjectApiImage[];
  codeSnippets?: unknown[];
};

export type ProjectApiContentSection = Omit<
  Partial<ContentSection>,
  "images" | "points" | "items"
> & {
  id?: string;
  images?: ProjectApiImage[];
  points?: ProjectApiContentPoint[];
  items?: ProjectApiSubItem[];
};

export type ProjectApiItem = Omit<
  Partial<RichProject>,
  "content" | "banner" | "thumbnail"
> & {
  _id: string;
  user_id: string;
  slug: string;
  title: string;
  tagline?: string;
  shortDescription?: string;
  banner?: ProjectApiImage;
  thumbnail?: ProjectApiImage;
  images?: ProjectApiImage[];
  content?: ProjectApiContentSection[];
  futureImprovements?: FutureImprovement[];
  cicd?: CICD;
  deployment?: DeploymentItem[];
  environmentVariables?: EnvVariableGroup[];
};

export type ProjectResponse = {
  success: boolean;
  data: ProjectApiItem[];
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
