import {
  Injectable,
  HttpException,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

import { AppLogger } from 'src/common/app.logger';
import { configDefaults } from 'src/config';
import {
  CloudinaryConfigurationMissingException,
  CloudinaryFolderRequiredException,
  CloudinaryInvalidImageCountException,
  CloudinarySignedUploadGenerationException,
} from 'src/exceptions/cloudinary.exceptions';

export interface SignedUploadItem {
  index: number;
  folder: string;
  public_id: string;
  timestamp: number;
  resource_type: string;
  signature: string;
  api_key: string;
  cloud_name: string;
  upload_url: string;
}

type CloudinaryResourceType = 'image' | 'raw' | 'video' | 'auto';
type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

@Injectable()
export class CloudinaryService
  implements OnModuleInit, OnApplicationShutdown
{
  private isConfigured = false;
  private isShuttingDown = false;
  private isConnectivityVerified = false;
  private isConnectivityCheckRunning = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    const environment =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production'
        ? 'prod'
        : 'dev';
    const maxRetries = Math.max(
      this.configService.getOrThrow<number>('CLOUDINARY_MAX_RETRIES'),
      1,
    );
    const retryDelayMs =
      this.configService.getOrThrow<number>('CLOUDINARY_RETRY_DELAY_SECONDS') *
      1000;
    const cooldownMs =
      this.configService.getOrThrow<number>('CLOUDINARY_COOLDOWN_SECONDS') *
      1000;

    const credentials = this.getCloudinaryCredentials(false);

    this.logger.log(
      `🧭 [Cloudinary] Environment: ${environment}`,
      CloudinaryService.name,
    );

    if (!credentials) {
      this.logger.warn(
        '⚠️ [Cloudinary] Credentials are not configured. Cloudinary operations will fail until CLOUDINARY_* values are set.',
        CloudinaryService.name,
      );
      return;
    }

    const target = `cloudinary://${credentials.cloudName}`;

    this.logger.log(
      `🔗 [Cloudinary] Target: ${target}`,
      CloudinaryService.name,
    );
    this.logger.log(
      `🌐 [Cloudinary] Upload base URL: ${configDefaults.cloudinary.uploadBaseUrl}`,
      CloudinaryService.name,
    );
    this.logger.log(
      `🗂️ [Cloudinary] Default resource type: ${configDefaults.cloudinary.defaultResourceType}`,
      CloudinaryService.name,
    );
    this.logger.log(
      `🔁 [Cloudinary] Max retries: ${maxRetries}`,
      CloudinaryService.name,
    );
    this.logger.log(
      `⏳ [Cloudinary] Retry delay: ${retryDelayMs / 1000}s`,
      CloudinaryService.name,
    );
    this.logger.log(
      `🧊 [Cloudinary] Cooldown after failure cycle: ${cooldownMs / 1000}s`,
      CloudinaryService.name,
    );
    this.configureClient(
      credentials.cloudName,
      credentials.apiKey,
      credentials.apiSecret,
    );
    this.isConfigured = true;

    void this.verifyConnectivityLoop(
      target,
      maxRetries,
      retryDelayMs,
      cooldownMs,
    );
  }

  onApplicationShutdown(): void {
    this.isShuttingDown = true;
  }

  generateSignedUploadUrls(
    folder: string,
    count: number,
    resourceType: CloudinaryResourceType = 'image',
  ) {
    if (!folder?.trim()) {
      throw new CloudinaryFolderRequiredException();
    }

    const maxUploadCount = configDefaults.cloudinary.maxUploadCount;

    if (!Number.isInteger(count) || count < 1 || count > maxUploadCount) {
      throw new CloudinaryInvalidImageCountException(maxUploadCount);
    }

    const { apiKey, apiSecret, cloudName } = this.ensureConfigured();
    const cleanFolder = this.normalizeFolder(folder);
    const timestamp = Math.floor(Date.now() / 1000);
    const publicIdSeed = Date.now();

    try {
      this.logger.log(
        `📝 [Cloudinary] Generating ${count} signed upload URL(s) for folder "${cleanFolder}" with resource type "${resourceType}"`,
        CloudinaryService.name,
      );

      const uploads: SignedUploadItem[] = Array.from(
        { length: count },
        (_, index) => {
          const publicId = this.buildPublicId(publicIdSeed, index + 1);
          const paramsToSign = {
            folder: cleanFolder,
            public_id: publicId,
            timestamp,
          };
          const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret,
          );

          return {
            index,
            folder: cleanFolder,
            public_id: publicId,
            timestamp,
            resource_type: resourceType,
            signature,
            api_key: apiKey,
            cloud_name: cloudName,
            upload_url: `${configDefaults.cloudinary.uploadBaseUrl}/${cloudName}/${resourceType}/upload`,
          };
        },
      );

      return {
        folder: cleanFolder,
        count,
        resourceType,
        uploads,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new CloudinarySignedUploadGenerationException();
    }
  }

  async destroy(
    publicId: string,
    resourceType: CloudinaryResourceType = 'image',
  ): Promise<void> {
    this.ensureConfigured();
    this.logger.log(
      `🧹 [Cloudinary] Destroying asset "${publicId}" with resource type "${resourceType}"`,
      CloudinaryService.name,
    );
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  }

  private normalizeFolder(folder: string): string {
    return folder
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\s+/g, '-')
      .replace(/\/{2,}/g, '/');
  }

  private buildPublicId(seed: number, serial: number): string {
    return `img-${seed}-${serial}`;
  }

  private configureClient(
    cloudName: string,
    apiKey: string,
    apiSecret: string,
  ): void {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  private ensureConfigured(): CloudinaryCredentials {
    const credentials = this.getCloudinaryCredentials(true);

    if (!this.isConfigured) {
      this.logger.log(
        '🟡 [Cloudinary] Trying to initialize client on demand',
        CloudinaryService.name,
      );
      this.configureClient(
        credentials.cloudName,
        credentials.apiKey,
        credentials.apiSecret,
      );
      this.isConfigured = true;
      this.logger.log(
        `✅ [Cloudinary] Client configured -> cloudinary://${credentials.cloudName}`,
        CloudinaryService.name,
      );
    }

    return credentials;
  }

  private getCloudinaryCredentials(
    throwIfMissing: true,
  ): CloudinaryCredentials;
  private getCloudinaryCredentials(
    throwIfMissing: false,
  ): CloudinaryCredentials | null;
  private getCloudinaryCredentials(
    throwIfMissing = true,
  ): CloudinaryCredentials | null {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      if (throwIfMissing) {
        throw new CloudinaryConfigurationMissingException();
      }

      return null;
    }

    return {
      cloudName,
      apiKey,
      apiSecret,
    };
  }

  private async verifyConnectivityLoop(
    target: string,
    maxRetries: number,
    retryDelayMs: number,
    cooldownMs: number,
  ): Promise<void> {
    if (this.isConnectivityCheckRunning || this.isConnectivityVerified) {
      return;
    }

    this.isConnectivityCheckRunning = true;

    try {
      while (!this.isShuttingDown && !this.isConnectivityVerified) {
        for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
          try {
            this.logger.log(
              `🟡 [Cloudinary] Attempt ${attempt}/${maxRetries} -> ${target}`,
              CloudinaryService.name,
            );
            await cloudinary.api.ping();
            this.isConnectivityVerified = true;
            this.logger.log(
              `✅ [Cloudinary] Connected -> ${target}`,
              CloudinaryService.name,
            );
            return;
          } catch (error: unknown) {
            const trace = error instanceof Error ? error.stack : undefined;
            const message =
              error instanceof Error ? error.message : 'unknown cloudinary error';

            this.logger.error(
              `❌ [Cloudinary] Attempt ${attempt}/${maxRetries} failed -> ${target} | ${message}`,
              trace,
              CloudinaryService.name,
            );

            if (attempt < maxRetries) {
              this.logger.warn(
                `⏳ [Cloudinary] Retrying in ${retryDelayMs / 1000}s`,
                CloudinaryService.name,
              );
              await this.sleep(retryDelayMs);
            }
          }
        }

        if (this.isShuttingDown || this.isConnectivityVerified) {
          return;
        }

        this.logger.warn(
          `🧊 [Cloudinary] All ${maxRetries} attempts failed for ${target}. Cooling down for ${cooldownMs / 1000}s before retrying.`,
          CloudinaryService.name,
        );
        await this.sleep(cooldownMs);
      }
    } finally {
      this.isConnectivityCheckRunning = false;
    }
  }

  private async sleep(ms: number): Promise<void> {
    if (ms <= 0) {
      return;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
