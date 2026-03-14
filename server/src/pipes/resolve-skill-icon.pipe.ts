import { Injectable } from '@nestjs/common';
import { ImageValidationService } from '../common/image/image-validation.service';
import type {
  ResolvedSkillInput,
} from '../common/image/image.types';
import { SkillDto } from 'src/dto';

@Injectable()
export class SkillInputResolverService {
  constructor(
    private readonly imageValidationService: ImageValidationService,
  ) {}

  resolveCreate(
    body: SkillDto,
    file?: Express.Multer.File,
  ): ResolvedSkillInput {
    this.imageValidationService.validateRequiredImageInput({
      file,
      url: body.iconUrl,
    });

    if (file) {
      this.imageValidationService.validateFile(file, {
        allowSvg: true,
        maxSizeBytes: 2 * 1024 * 1024,
      });

      return {
        name: body.name,
        category: body.category,
        icon: {
          sourceType: 'file',
          file,
        },
      };
    }

    this.imageValidationService.validateUrl(body.iconUrl!, {
      allowedProtocols: ['https:'],
    });

    return {
      name: body.name,
      category: body.category,
      icon: {
        sourceType: 'url',
        url: body.iconUrl!,
      },
    };
  }

  resolveUpdate(
    body: Partial<SkillDto>,
    file?: Express.Multer.File,
  ): Partial<ResolvedSkillInput> {
    this.imageValidationService.validateOptionalImageInput({
      file,
      url: body.iconUrl,
    });

    if (!file && !body.iconUrl?.trim()) {
      return {
        name: body.name,
        category: body.category,
      };
    }

    if (file) {
      this.imageValidationService.validateFile(file, {
        allowSvg: true,
        maxSizeBytes: 2 * 1024 * 1024,
      });

      return {
        name: body.name,
        category: body.category,
        icon: {
          sourceType: 'file',
          file,
        },
      };
    }

    this.imageValidationService.validateUrl(body.iconUrl!, {
      allowedProtocols: ['https:'],
    });

    return {
      name: body.name,
      category: body.category,
      icon: {
        sourceType: 'url',
        url: body.iconUrl!,
      },
    };
  }
}