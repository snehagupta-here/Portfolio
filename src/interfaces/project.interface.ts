import { ImageAsset } from 'src/schema/image-asset.schema';

export type ProjectFlexibleObject = Record<string, unknown>;

export interface ProjectMeta {
  category?: string;
  projectType?: string[];
  difficulty?: string;
  status?: string;
  estimatedReadTime?: string;
  tags?: string[];
  completedAt?: string | Date;
  duration?: string;
}

export interface ProjectThumbnail {
  url?: string;
  alt?: string;
}

export interface ProjectCodeSnippet {
  filename?: string;
  language?: string;
  description?: string[];
  code?: string[];
}

export interface ProjectImage {
  url?: ImageAsset;
  caption?: string;
}

export interface ProjectQuestion {
  question?: string;
  answer?: string;
}

export interface ProjectContentPoint {
  label?: string;
  description?: string;
}

export interface ProjectContentItem {
  subHeading?: string;
  paragraphs?: string[];
  points?: string[];
  images?: ProjectImage[];
  codeSnippets?: ProjectCodeSnippet[];
}

export interface ProjectContentSection {
  id?: string;
  contentType?: string;
  type?: string;
  heading?: string;
  paragraphs?: string[];
  codeSnippets?: ProjectCodeSnippet[];
  items?: ProjectContentItem[];
  points?: ProjectContentPoint[];
  images?: ProjectImage[];
  questions?: ProjectQuestion[];
}

export interface ProjectFutureImprovement {
  title?: string;
  description?: string;
}

export interface ProjectRepository {
  type?: string;
  url?: string;
  branch?: string;
  visibility?: string;
}

export interface ProjectAuthor {
  name?: string;
  avatar?: ImageAsset;
  github?: string;
  linkedin?: string;
}

export interface ProjectMetadata {
  status?: string;
  publishedDate?: string | Date;
  lastModified?: string | Date;
  featured?: boolean;
  trending?: boolean;
  readTime?: number;
  views?: number;
  likes?: number;
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CreateProject {
  title: string;
  slug: string;
  tagline?: string;
  shortDescription?: string;
  meta?: ProjectMeta;
  thumbnail?: ProjectThumbnail;
  content?: ProjectContentSection[];
  database?: ProjectFlexibleObject;
  apis?: ProjectFlexibleObject;
  performance?: ProjectFlexibleObject[];
  testing?: ProjectFlexibleObject[];
  folderStructure?: ProjectFlexibleObject[];
  pages?: ProjectFlexibleObject[];
  cicd?: ProjectFlexibleObject;
  deployment?: ProjectFlexibleObject[];
  environmentVariables?: ProjectFlexibleObject[];
  futureImprovements?: ProjectFutureImprovement[];
  repository?: ProjectRepository[];
  liveUrl?: string;
  author?: ProjectAuthor;
  metadata?: ProjectMetadata;
  seo?: ProjectSeo;
  isActive?: boolean;
}

export type UpdateProject = Partial<CreateProject>;
