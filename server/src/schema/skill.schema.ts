import { SkillCategoryEnum } from 'src/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type SkillDocument = HydratedDocument<Skill>;

@Schema({ _id: false })
export class SkillIcon {
  @Prop({ type: String, required: true })
  publicId!: string;

  @Prop({ type: String, required: true })
  secureUrl!: string;

  @Prop({ type: Number })
  width?: number;

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: String })
  format?: string;

  @Prop({ type: String })
  resourceType?: string;

  @Prop({ type: Number })
  bytes?: number;

  @Prop({ type: String })
  originalFilename?: string;
}

export const SkillIconSchema = SchemaFactory.createForClass(SkillIcon);

@Schema({ collection: 'skills', timestamps: true })
export class Skill extends Document {
  @Prop({ type: String, required: true, trim: true })
  name!: string;

    @Prop({
    type: String,
    enum: SkillCategoryEnum,
    required: true,
  })
  category!: SkillCategoryEnum;

  @Prop({ type: SkillIconSchema })
  icon?: SkillIcon;
}

export const SkillSchema = SchemaFactory.createForClass(Skill);