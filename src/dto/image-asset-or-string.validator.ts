import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const ALLOWED_ASSET_KEYS = new Set([
  'publicId',
  'secureUrl',
  'width',
  'height',
  'format',
  'resourceType',
  'bytes',
  'originalFilename',
]);

const ALLOWED_RESOURCE_TYPES = new Set(['image', 'raw', 'video', 'auto']);

@ValidatorConstraint({ name: 'isImageAssetOrString', async: false })
export class IsImageAssetOrStringConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (value === undefined || value === null) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      return false;
    }

    const asset = value as Record<string, unknown>;
    const keys = Object.keys(asset);

    if (!keys.every((key) => ALLOWED_ASSET_KEYS.has(key))) {
      return false;
    }

    if (
      typeof asset.publicId !== 'string' ||
      asset.publicId.trim().length === 0 ||
      typeof asset.secureUrl !== 'string' ||
      asset.secureUrl.trim().length === 0
    ) {
      return false;
    }

    if (
      asset.width !== undefined &&
      (!Number.isInteger(asset.width) || (asset.width as number) < 0)
    ) {
      return false;
    }

    if (
      asset.height !== undefined &&
      (!Number.isInteger(asset.height) || (asset.height as number) < 0)
    ) {
      return false;
    }

    if (asset.format !== undefined && typeof asset.format !== 'string') {
      return false;
    }

    if (
      asset.resourceType !== undefined &&
      (typeof asset.resourceType !== 'string' ||
        !ALLOWED_RESOURCE_TYPES.has(asset.resourceType))
    ) {
      return false;
    }

    if (
      asset.bytes !== undefined &&
      (!Number.isInteger(asset.bytes) || (asset.bytes as number) < 0)
    ) {
      return false;
    }

    if (
      asset.originalFilename !== undefined &&
      typeof asset.originalFilename !== 'string'
    ) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} must be a non-empty string or a valid cloudinary asset object`;
  }
}
