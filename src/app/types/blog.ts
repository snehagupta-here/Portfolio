export type BlogContentType =
  | "headingBased"
  | "subHeadingBased"
  | "pointBased"
  | "questionBased"
  | "conclusionBased";

export type BlogSectionType = "intro" | "section" | "faq" | "conclusion";

export type BlogCodeSnippet = {
  language: string;
  code: string;
};

export type BlogSubHeadingItem = {
  subHeading: string;
  description: string;
  points: string[];
  images: string[];
  codeSnippet: BlogCodeSnippet[];
};

export type BlogQuestion = {
  question: string;
  answer: string;
};

export type BlogSection = {
  id: string;
  contentType: BlogContentType;
  type: BlogSectionType;
  heading: string;
  text?: string;
  images?: string[];
  items?: BlogSubHeadingItem[];
  points?: string[];
  codeSnippet?: BlogCodeSnippet[];
  questions?: BlogQuestion[];
};

export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  content: string;
  thumbnail: string;
  banner: string;
  date: string;
  readingTime: number;
  author?: { name: string; avatar?: string };
  tags: string[];
  sections?: BlogSection[];
  featured?: boolean;
};

