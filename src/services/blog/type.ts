import type {
  BlogCodeSnippet,
  BlogContentType,
  BlogQuestion,
  BlogSectionType,
} from "@/app/types/blog";

export type BlogApiImage = {
  publicId?: string;
  public_id?: string;
  secureUrl?: string;
  secure_url?: string;
  url?: string;
  src?: string;
  width?: number;
  height?: number;
  format?: string;
  resourceType?: string;
  resource_type?: string;
  bytes?: number;
  originalFilename?: string;
  original_filename?: string;
};

export type BlogApiSubHeadingItem = {
  subHeading: string;
  description?: string;
  points?: string[];
  images?: BlogApiImage[];
  codeSnippet?: BlogCodeSnippet[];
};

export type BlogApiSection = {
  id?: string;
  contentType?: BlogContentType;
  type?: BlogSectionType;
  heading?: string;
  text?: string;
  points?: string[];
  items?: BlogApiSubHeadingItem[];
  questions?: BlogQuestion[];
  images?: BlogApiImage[];
  codeSnippet?: BlogCodeSnippet[];
};

export type BlogApiItem = {
  _id: string;
  user_id: string;
  title: string;
  slug: string;
  description?: string;
  content?: BlogApiSection[];
  author?: { name?: string; avatar?: string };
  metadata?: {
    publishedDate?: string;
    lastModified?: string;
    featured?: boolean;
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
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type BlogResponse = {
  success: boolean;
  data: BlogApiItem[];
  statusCode: number;
  message: string;
  timeStamp: string;
  path: string;
};
