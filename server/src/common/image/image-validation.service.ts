import { BadRequestException, Injectable } from '@nestjs/common';
import { ImageValidationOptions } from './image.types';

@Injectable()
export class ImageValidationService {
  private readonly defaultAllowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml',
  ];

  private hasImageLikePath(url: URL): boolean {
    const pathname = url.pathname.toLowerCase();

    return (
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.avif')
    );
  }
  private readonly defaultMaxSizeBytes = 2 * 1024 * 1024;

  validateRequiredImageInput(input: {
    file?: Express.Multer.File;
    url?: string;
  }): void {
    const hasFile = !!input.file;
    const hasUrl = !!input.url?.trim();

    if (!hasFile && !hasUrl) {
      throw new BadRequestException(
        'Please provide either an image file or an image URL.',
      );
    }

    if (hasFile && hasUrl) {
      throw new BadRequestException(
        'Please provide only one image source: either upload a file or enter an image URL.',
      );
    }
  }

  validateOptionalImageInput(input: {
    file?: Express.Multer.File;
    url?: string;
  }): void {
    const hasFile = !!input.file;
    const hasUrl = !!input.url?.trim();

    if (hasFile && hasUrl) {
      throw new BadRequestException(
        'Please provide only one image source: either upload a file or enter an image URL.',
      );
    }
  }

  validateFile(
    file: Express.Multer.File,
    options: ImageValidationOptions = {},
  ): void {
    const allowedMimeTypes =
      options.allowedMimeTypes ?? this.defaultAllowedMimeTypes;
    const maxSizeBytes = options.maxSizeBytes ?? this.defaultMaxSizeBytes;

    if (!file) {
      throw new BadRequestException('Image file is required.');
    }

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid image type. Allowed types are PNG, JPG, JPEG, WEBP, and SVG.',
      );
    }

    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `Image size must be less than ${Math.floor(maxSizeBytes / (1024 * 1024))}MB.`,
      );
    }

    if (!options.allowSvg && file.mimetype === 'image/svg+xml') {
      throw new BadRequestException('SVG images are not allowed.');
    }
  }

  validateUrl(url: string, options: ImageValidationOptions = {}): URL {
    if (!url?.trim()) {
      throw new BadRequestException('Image URL is required.');
    }

    let parsed: URL;

    try {
      parsed = new URL(url);
    } catch {
      throw new BadRequestException('Please enter a valid image URL.');
    }

    const allowedProtocols = options.allowedProtocols ?? ['https:'];
    if (!allowedProtocols.includes(parsed.protocol)) {
      throw new BadRequestException('Only HTTPS image URLs are allowed.');
    }

    const hostname = parsed.hostname.toLowerCase();

    if (this.isBlockedHost(hostname)) {
      throw new BadRequestException(
        'Local, private, or non-public image URLs are not allowed.',
      );
    }

    if (!this.hasImageLikePath(parsed)) {
      throw new BadRequestException(
        'Please provide a direct image URL, not a webpage link.',
      );
    }

    if (
      options.allowedDomains?.length &&
      !this.matchesAllowedDomain(hostname, options.allowedDomains)
    ) {
      throw new BadRequestException('This image domain is not allowed.');
    }

    if (
      options.blockedDomains?.length &&
      this.matchesAllowedDomain(hostname, options.blockedDomains)
    ) {
      throw new BadRequestException('This image domain is blocked.');
    }

    return parsed;
  }

  private isBlockedHost(hostname: string): boolean {
    if (
      hostname === 'localhost' ||
      hostname === '0.0.0.0' ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    ) {
      return true;
    }

    if (hostname.endsWith('.local')) {
      return true;
    }

    if (this.isPrivateIPv4(hostname)) {
      return true;
    }

    return false;
  }

  private isPrivateIPv4(hostname: string): boolean {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(hostname)) return false;

    const parts = hostname.split('.').map(Number);
    if (parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false;

    const [a, b] = parts;

    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;

    return false;
  }

  private matchesAllowedDomain(hostname: string, domains: string[]): boolean {
    return domains.some((domain) => {
      const normalized = domain.toLowerCase();
      return hostname === normalized || hostname.endsWith(`.${normalized}`);
    });
  }
}
