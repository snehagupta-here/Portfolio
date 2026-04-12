export interface BlogCodeSnippet {
  language: string;
  code: string;
}

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogSubItem {
  subHeading: string;
  description?: string;
  points?: string[];
  images?: string[];
  codeSnippet?: BlogCodeSnippet[];
}

export interface BlogContentSection {
  id: string;
  contentType: string;
  type: string;
  heading?: string;
  text?: string;
  points?: string[];
  items?: BlogSubItem[];
  questions?: BlogFAQ[];
  images?: string[];
  codeSnippet?: BlogCodeSnippet[];
}

export interface BlogMedia {
  type?: string;
  thumbnail?: string;
}

export interface BlogAuthor {
  name?: string;
  avatar?: string;
}

export interface BlogMetadata {
  publishedDate?: string | Date;
  lastModified?: string | Date;
  featured?: boolean;
  readTime?: number;
  views?: number;
  likes?: number;
}

export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
}

export interface CreateBlog {
  title: string;
  slug: string;
  description?: string;
  content?: BlogContentSection[];
  media?: BlogMedia;
  author?: BlogAuthor;
  metadata?: BlogMetadata;
  seo?: BlogSeo;
  isActive?: boolean;
}

export type UpdateBlog = Partial<CreateBlog>;
