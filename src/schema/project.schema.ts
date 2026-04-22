import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

import type {
  ProjectAuthor as ProjectAuthorShape,
  ProjectCodeSnippet as ProjectCodeSnippetShape,
  ProjectContentItem as ProjectContentItemShape,
  ProjectContentPoint as ProjectContentPointShape,
  ProjectContentSection as ProjectContentSectionShape,
  ProjectFlexibleObject,
  ProjectFutureImprovement as ProjectFutureImprovementShape,
  ProjectImage as ProjectImageShape,
  ProjectMeta as ProjectMetaShape,
  ProjectMetadata as ProjectMetadataShape,
  ProjectQuestion as ProjectQuestionShape,
  ProjectRepository as ProjectRepositoryShape,
  ProjectSeo as ProjectSeoShape,
} from 'src/interfaces/project.interface';
import { ImageAsset, ImageAssetSchema } from './image-asset.schema';
import { ContentTypeEnum, SectionTypeEnum } from 'src/enums';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ _id: false })
class ProjectCodeSnippet implements ProjectCodeSnippetShape {
  @Prop({ type: String })
  filename!: string;

  @Prop({ type: String })
  language!: string;

  @Prop({ type: [String] })
  description!: string[];

  @Prop({ type: [String] })
  code!: string[];
}

const ProjectCodeSnippetSchema =
  SchemaFactory.createForClass(ProjectCodeSnippet);

@Schema({ _id: false })
class ProjectImage implements ProjectImageShape {
  @Prop({ type: String })
  url!: string;

  @Prop({ type: String })
  caption!: string;
}

const ProjectImageSchema = SchemaFactory.createForClass(ProjectImage);

@Schema({ _id: false })
class ProjectQuestion implements ProjectQuestionShape {
  @Prop({ type: String })
  question!: string;

  @Prop({ type: String })
  answer!: string;
}

const ProjectQuestionSchema = SchemaFactory.createForClass(ProjectQuestion);

@Schema({ _id: false })
class ProjectContentPoint implements ProjectContentPointShape {
  @Prop({ type: String })
  label!: string;

  @Prop({ type: String })
  description!: string;
}

const ProjectContentPointSchema =
  SchemaFactory.createForClass(ProjectContentPoint);

@Schema({ _id: false })
class ProjectContentItem implements ProjectContentItemShape {
  @Prop({ type: String })
  subHeading!: string;

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [ProjectImageSchema], default: [] })
  images!: ProjectImage[];

  @Prop({ type: [ProjectCodeSnippetSchema], default: [] })
  codeSnippets!: ProjectCodeSnippet[];
}

const ProjectContentItemSchema =
  SchemaFactory.createForClass(ProjectContentItem);

@Schema({ _id: false })
class ProjectContentSection implements ProjectContentSectionShape {
  @Prop({ type: String })
  id!: string;

  @Prop({
    type: String,
    enum: ContentTypeEnum,
    required: true,
  })
  contentType!: ContentTypeEnum;

  @Prop({
    type: String,
    enum: SectionTypeEnum,
    required: true,
  })
  type!: SectionTypeEnum;

  @Prop({ type: String })
  heading!: string;

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [ProjectCodeSnippetSchema], default: [] })
  codeSnippets!: ProjectCodeSnippet[];

  @Prop({ type: [ProjectContentItemSchema], default: [] })
  items!: ProjectContentItem[];

  @Prop({ type: [ProjectContentPointSchema], default: [] })
  points!: ProjectContentPoint[];

  @Prop({ type: [ProjectImageSchema], default: [] })
  images!: ProjectImage[];

  @Prop({ type: [ProjectQuestionSchema], default: [] })
  questions!: ProjectQuestion[];
}

const ProjectContentSectionSchema = SchemaFactory.createForClass(
  ProjectContentSection,
);

@Schema({ _id: false })
class ProjectMeta implements ProjectMetaShape {
  @Prop({ type: String })
  category!: string;

  @Prop({ type: [String], default: [] })
  projectType!: string[];

  @Prop({ type: String })
  difficulty!: string;

  @Prop({ type: String })
  status!: string;

  @Prop({ type: String })
  estimatedReadTime!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: Date })
  completedAt!: Date;

  @Prop({ type: String })
  duration!: string;
}

const ProjectMetaSchema = SchemaFactory.createForClass(ProjectMeta);

@Schema({ _id: false })
class ProjectFutureImprovement implements ProjectFutureImprovementShape {
  @Prop({ type: String })
  title!: string;

  @Prop({ type: String })
  description!: string;
}

const ProjectFutureImprovementSchema = SchemaFactory.createForClass(
  ProjectFutureImprovement,
);

@Schema({ _id: false })
class ProjectRepository implements ProjectRepositoryShape {
  @Prop({ type: String })
  type!: string;

  @Prop({ type: String })
  url!: string;

  @Prop({ type: String })
  branch!: string;

  @Prop({ type: String })
  visibility!: string;
}

const ProjectRepositorySchema = SchemaFactory.createForClass(ProjectRepository);

@Schema({ _id: false })
class ProjectAuthor implements ProjectAuthorShape {
  @Prop({ type: String })
  name!: string;

  @Prop({ type: String })
  avatar!: string;

  @Prop({ type: String })
  github!: string;

  @Prop({ type: String })
  linkedin!: string;
}

const ProjectAuthorSchema = SchemaFactory.createForClass(ProjectAuthor);

@Schema({ _id: false })
class ProjectMetadata implements ProjectMetadataShape {
  @Prop({ type: String })
  status!: string;

  @Prop({ type: Date })
  publishedDate!: Date;

  @Prop({ type: Date })
  lastModified!: Date;

  @Prop({ type: Boolean, default: false })
  featured!: boolean;

  @Prop({ type: Boolean, default: false })
  trending!: boolean;

  @Prop({ type: Number })
  readTime!: number;

  @Prop({ type: Number, default: 0 })
  views!: number;

  @Prop({ type: Number, default: 0 })
  likes!: number;
}

const ProjectMetadataSchema = SchemaFactory.createForClass(ProjectMetadata);

@Schema({ _id: false })
class ProjectSeo implements ProjectSeoShape {
  @Prop({ type: String })
  metaTitle!: string;

  @Prop({ type: String })
  metaDescription!: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];
}

const ProjectSeoSchema = SchemaFactory.createForClass(ProjectSeo);

@Schema({ collection: 'projects', timestamps: true })
export class Project extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, required: true, unique: true, index: true })
  slug!: string;

  @Prop({ type: String })
  tagline!: string;

  @Prop({ type: String })
  shortDescription!: string;

  @Prop({ type: ProjectMetaSchema })
  meta!: ProjectMeta;

  @Prop({ type: ImageAssetSchema })
  thumbnail!: ImageAsset;

  @Prop({ type: [ProjectContentSectionSchema], default: [] })
  content!: ProjectContentSection[];

  @Prop({ type: Object })
  database!: ProjectFlexibleObject;

  @Prop({ type: Object })
  apis!: ProjectFlexibleObject;

  @Prop({ type: Object })
  performance!: ProjectFlexibleObject;

  @Prop({ type: Object })
  testing!: ProjectFlexibleObject;

  @Prop({ type: Object })
  folderStructure!: ProjectFlexibleObject;

  @Prop({ type: Object })
  pages!: ProjectFlexibleObject;

  @Prop({ type: Object })
  cicd!: ProjectFlexibleObject;

  @Prop({ type: Object })
  deployment!: ProjectFlexibleObject;

  @Prop({ type: Object })
  environmentVariables!: ProjectFlexibleObject;

  @Prop({ type: [ProjectFutureImprovementSchema], default: [] })
  futureImprovements!: ProjectFutureImprovement[];

  @Prop({ type: [ProjectRepositorySchema], default: [] })
  repository!: ProjectRepository[];

  @Prop({ type: String })
  liveUrl!: string;

  @Prop({ type: ProjectAuthorSchema })
  author!: ProjectAuthor;

  @Prop({ type: ProjectMetadataSchema })
  metadata!: ProjectMetadata;

  @Prop({ type: ProjectSeoSchema })
  seo!: ProjectSeo;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
