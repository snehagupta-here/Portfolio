export interface CreateProject {
  title: string;
  slug: string;
  tagline?: string;
  shortDescription?: string;

  meta?: {
    category?: string;
    projectType?: string[];
    difficulty?: string;
    status?: string;
    estimatedReadTime?: string;
    tags?: string[];
    completedAt?: Date;
    duration?: string;
  };

  thumbnail?: {
    url?: string;
    alt?: string;
  };

  content?: any[];

  database?: any;

  apis?: any;

  performance?: any[];

  testing?: any[];

  folderStructure?: any[];

  pages?: any[];

  cicd?: any;

  deployment?: any[];

  environmentVariables?: any[];

  futureImprovements?: {
    title: string;
    description: string;
  }[];

  repository?: {
    type?: string;
    url?: string;
    branch?: string;
    visibility?: string;
  }[];

  liveUrl?: string;

  author?: {
    name?: string;
    avatar?: string;
    github?: string;
    linkedin?: string;
  };

  metadata?: {
    status?: string;
    publishedDate?: Date;
    lastModified?: Date;
    featured?: boolean;
    trending?: boolean;
    readTime?: number;
    views?: number;
    likes?: number;
  };

  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  isActive?: boolean;
}

export type UpdateProject = Partial<CreateProject>;