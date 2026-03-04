import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

/* ---------------------- Content Blocks ---------------------- */

@Schema({ _id: false })
class CodeSnippet {
  @Prop() filename!: string;

  @Prop() language!: string;

  @Prop() description!: string;

  @Prop() code!: string;
}

const CodeSnippetSchema = SchemaFactory.createForClass(CodeSnippet);

@Schema({ _id: false })
class Image {
  @Prop() url!: string;

  @Prop() alt!: string;

  @Prop() caption!: string;
}

const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ _id: false })
class Question {
  @Prop() question!: string;

  @Prop() answer!: string;
}

const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ _id: false })
class ContentItem {
  @Prop() subHeading!: string;

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [ImageSchema], default: [] })
  images!: Image[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippets!: CodeSnippet[];
}

const ContentItemSchema = SchemaFactory.createForClass(ContentItem);

@Schema({ _id: false })
class Content {
  @Prop() id!: string;

  @Prop() contentType!: string;

  @Prop() type!: string;

  @Prop() heading!: string;

  @Prop({ type: [String], default: [] })
  paragraphs!: string[];

  @Prop({ type: [ContentItemSchema], default: [] })
  items!: ContentItem[];

  @Prop({ type: [{ label: String, description: String }], default: [] })
  points!: { label: string; description: string }[];

  @Prop({ type: [ImageSchema], default: [] })
  images!: Image[];

  @Prop({ type: [QuestionSchema], default: [] })
  questions!: Question[];
}

const ContentSchema = SchemaFactory.createForClass(Content);

/* ---------------------- Author ---------------------- */

@Schema({ _id: false })
class Author {
  @Prop() name!: string;

  @Prop() avatar!: string;

  @Prop() github!: string;

  @Prop() linkedin!: string;
}

const AuthorSchema = SchemaFactory.createForClass(Author);

/* ---------------------- Metadata ---------------------- */

@Schema({ _id: false })
class Metadata {
  @Prop() status!: string;

  @Prop() publishedDate!: Date;

  @Prop() lastModified!: Date;

  @Prop({ default: false }) featured!: boolean;

  @Prop({ default: false }) trending!: boolean;

  @Prop() readTime!: number;

  @Prop({ default: 0 }) views!: number;

  @Prop({ default: 0 }) likes!: number;
}

const MetadataSchema = SchemaFactory.createForClass(Metadata);

/* ---------------------- SEO ---------------------- */

@Schema({ _id: false })
class SEO {
  @Prop() metaTitle!: string;

  @Prop() metaDescription!: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];
}

const SEOSchema = SchemaFactory.createForClass(SEO);

/* ---------------------- Main Project Schema ---------------------- */

@Schema({ collection: 'projects', timestamps: true })
export class Project extends Document {

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true, unique: true })
  slug!: string;

  @Prop()
  tagline!: string;

  @Prop()
  shortDescription!: string;

  @Prop({
    type: {
      category: String,
      projectType: [String],
      difficulty: String,
      status: String,
      estimatedReadTime: String,
      tags: [String],
      completedAt: Date,
      duration: String,
    },
  })
  meta!: any;

  @Prop({
    type: {
      url: String,
      alt: String,
    },
  })
  thumbnail!: {
    url: string;
    alt: string;
  };

  @Prop({ type: [ContentSchema], default: [] })
  content!: Content[];

  @Prop({ type: Object })
  database!: any;

  @Prop({ type: Object })
  apis!: any;

  @Prop({ type: [Object], default: [] })
  performance!: any[];

  @Prop({ type: [Object], default: [] })
  testing!: any[];

  @Prop({ type: [Object], default: [] })
  folderStructure!: any[];

  @Prop({ type: [Object], default: [] })
  pages!: any[];

  @Prop({ type: Object })
  cicd!: any;

  @Prop({ type: [Object], default: [] })
  deployment!: any[];

  @Prop({ type: [Object], default: [] })
  environmentVariables!: any[];

  @Prop({
    type: [{ title: String, description: String }],
    default: [],
  })
  futureImprovements!: { title: string; description: string }[];

  @Prop({
    type: [
      {
        type: String,
        url: String,
        branch: String,
        visibility: String,
      },
    ],
    default: [],
  })
  repository!: any[];

  @Prop()
  liveUrl!: string;

  @Prop({ type: AuthorSchema })
  author!: Author;

  @Prop({ type: MetadataSchema })
  metadata!: Metadata;

  @Prop({ type: SEOSchema })
  seo!: SEO;

  @Prop({ default: true })
  isActive!: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);