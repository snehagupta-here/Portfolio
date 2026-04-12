import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ContentTypeEnum, SectionTypeEnum } from 'src/enums';
import { ImageAssetSchema, ImageAsset } from './image-asset.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ _id: false })
class CodeSnippet {
  @Prop({ type: String })
  language!: string;

  @Prop({ type: String })
  code!: string;
}

const CodeSnippetSchema = SchemaFactory.createForClass(CodeSnippet);

@Schema({ _id: false })
class FAQ {
  @Prop({ type: String })
  question!: string;

  @Prop({ type: String })
  answer!: string;
}

const FAQSchema = SchemaFactory.createForClass(FAQ);

@Schema({ _id: false })
class SubItem {
  @Prop({ type: String })
  subHeading!: string;

  @Prop({ type: String })
  description!: string;

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [ImageAssetSchema], default: [] })
  images!: ImageAsset[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

const SubItemSchema = SchemaFactory.createForClass(SubItem);

@Schema({ _id: false })
class ContentSection {
  @Prop({ type: String, required: true })
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

  @Prop({ type: String })
  text!: string;

  @Prop({ type: [String], default: [] })
  points!: string[];

  @Prop({ type: [SubItemSchema], default: [] })
  items!: SubItem[];

  @Prop({ type: [FAQSchema], default: [] })
  questions!: FAQ[];

  @Prop({ type: [ImageAssetSchema], default: [] })
  images!: ImageAsset[];

  @Prop({ type: [CodeSnippetSchema], default: [] })
  codeSnippet!: CodeSnippet[];
}

const ContentSectionSchema = SchemaFactory.createForClass(ContentSection);

@Schema({ _id: false })
class Author {
  @Prop({ type: String, required: true })
  name!: string;

  @Prop({ type: ImageAssetSchema })
  avatar!: ImageAsset;
}

const AuthorSchema = SchemaFactory.createForClass(Author);

@Schema({ _id: false })
class Metadata {
  @Prop({ type: Date })
  publishedDate!: Date;

  @Prop({ type: Date })
  lastModified!: Date;

  @Prop({ type: Boolean, default: false })
  featured!: boolean;

  @Prop({ type: Number })
  readTime!: number;

  @Prop({ default: 0 }) views!: number;

  @Prop({ default: 0 }) likes!: number;
}

const MetadataSchema = SchemaFactory.createForClass(Metadata);

@Schema({ _id: false })
class SEO {
  @Prop({ type: String })
  metaTitle!: string;

  @Prop({ type: String })
  metaDescription!: string;

  @Prop({ type: [String], default: [] })
  keywords!: string[];
}

const SEOSchema = SchemaFactory.createForClass(SEO);

@Schema({ collection: 'blogs', timestamps: true })
export class Blog extends Document {
  @Prop({ type: String, required: true })
  title!: string;

  @Prop({ type: String, unique: true, index: true, required: true })
  slug!: string;

  @Prop({ type: String, required: true })
  description!: string;

  @Prop({ type: [ContentSectionSchema], default: [] })
  content!: ContentSection[];

  @Prop({ type: ImageAssetSchema })
  thumbnail!: ImageAsset;

  @Prop({ type: AuthorSchema, required: true })
  author!: Author;

  @Prop({ type: MetadataSchema })
  metadata!: Metadata;

  @Prop({ type: SEOSchema })
  seo!: SEO;

  @Prop({ type: Boolean, default: false, index: true })
  isActive!: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
