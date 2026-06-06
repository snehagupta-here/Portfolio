import todoBanner from "@/assets/todo-app-banner.jpg";
import todoArchitecture from "@/assets/todo-architecture.jpg";
import todoDbSchema from "@/assets/todo-db-schema.jpg";
import todoAuthFlow from "@/assets/todo-auth-flow.jpg";

// ── Rich Project Schema Types ──

export interface RichImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface CodeSnippet {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface ContentPoint {
  label: string;
  description: string;
}

export interface ContentSubItem {
  subHeading: string;
  paragraphs: string[];
  points?: string[];
  images?: RichImage[];
  codeSnippets?: CodeSnippet[];
}

export interface FAQQuestion {
  question: string;
  answer: string;
}

export interface ContentSection {
  id: string;
  contentType: "headingBased" | "pointBased" | "subHeadingBased" | "questionBased";
  type: string;
  heading: string;
  paragraphs: string[];
  images?: RichImage[];
  points?: ContentPoint[];
  items?: ContentSubItem[];
  questions?: FAQQuestion[];
}

export interface APIEndpoint {
  id: string;
  name: string;
  method: string;
  route: string;
  access: string;
  description: string;
}

export interface APIGroup {
  groupName: string;
  basePath: string;
  endpoints: APIEndpoint[];
}

export interface DBColumn {
  name: string;
  type: string;
  nullable: boolean;
  constraints: string;
}

export interface DBIndex {
  name: string;
  columns: string[];
  type: string;
  reason: string;
  condition?: string;
}

export interface DBTable {
  name: string;
  description: string;
  columns: DBColumn[];
  indexes: DBIndex[];
}

export interface FutureImprovement {
  title: string;
  description: string;
}

// ── New Schema Types ──

export interface PerformanceItem {
  id: string;
  type: string;
  name: string;
  description: string;
  layer: string;
  target: { entity: string; scope: string };
  configuration: {
    tool: string;
    strategy: string;
    settings: Record<string, string | number>;
  };
  triggers: string[];
  metrics: { expectedImprovement: string; complexityImpact: string };
  status: string;
}

export interface TestingItem {
  id: string;
  type: string;
  name: string;
  description: string;
  layer: string;
  tools: string[];
  target: { scope: string[] | string; filePattern: string };
  configuration: { environment: string; mocking: string; databaseReset: string };
  coverage: { targetPercentage: number; focusAreas: string[] };
  status: string;
}

export interface FolderNode {
  id: string;
  name: string;
  type: "folder" | "file";
  description?: string;
  children?: FolderNode[];
}

export interface PageSection {
  name: string;
  description: string;
}

export interface ProjectPage {
  id: string;
  name: string;
  route: string;
  access: string;
  layout: string;
  description: string;
  purpose: string;
  sections: PageSection[];
  rendering: string;
  screenshot?: RichImage;
}

export interface CICDPipelineStep {
  step: number;
  name: string;
  command: string;
}

export interface CICD {
  tool: string;
  trigger: string;
  pipeline: CICDPipelineStep[];
  blockers: string;
}

export interface DeploymentItem {
  type: string;
  details: Record<string, string>[];
}

export interface EnvVariableItem {
  key: string;
  description: string;
  example: string;
}

export interface EnvVariableGroup {
  type: string;
  variable: EnvVariableItem[];
}

export interface RichProject {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  meta: {
    category: string;
    projectType: string[];
    difficulty: string;
    status: string;
    featured: boolean;
    estimatedReadTime: string;
    tags: string[];
    completedAt: string;
    duration: string;
  };
  banner: RichImage;
  thumbnail: RichImage;
  content: ContentSection[];
  apis?: {
    baseUrl: string;
    authentication: string;
    groups: APIGroup[];
  };
  database?: {
    type: string;
    tables: DBTable[];
  };
  futureImprovements?: FutureImprovement[];
  performance?: PerformanceItem[];
  testing?: TestingItem[];
  folderStructure?: FolderNode[];
  pages?: ProjectPage[];
  cicd?: CICD;
  deployment?: DeploymentItem[];
  environmentVariables?: EnvVariableGroup[];
}
