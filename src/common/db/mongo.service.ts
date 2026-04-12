import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

import { AppLogger } from '../app.logger';

type MongoSettings = {
  environment: 'dev' | 'prod';
  baseUri: string;
  explicitDatabaseName: string | null;
  databaseName: string;
  target: string;
  connectTimeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
  cooldownMs: number;
};

function maskMongoUrl(uri: string): string {
  return uri.replace(/\/\/([^/@]+)@/, '//***:***@');
}

function splitMongoUri(uri: string): {
  baseUri: string;
  explicitDatabaseName: string | null;
  displayUri: string;
} {
  const match = uri.match(
    /^(mongodb(?:\+srv)?:\/\/[^/?]+)(?:\/([^?]*))?(\?.*)?$/,
  );

  if (!match) {
    return {
      baseUri: uri,
      explicitDatabaseName: null,
      displayUri: uri.replace(/\?.*$/, '').replace(/\/$/, ''),
    };
  }

  const [, baseUri, databaseName, query = ''] = match;

  return {
    baseUri: `${baseUri}${query}`,
    explicitDatabaseName: databaseName?.trim() ? databaseName : null,
    displayUri: baseUri,
  };
}

@Injectable()
export class MongoService implements OnModuleInit, OnApplicationShutdown {
  private isShuttingDown = false;
  private eventsBound = false;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly configService: ConfigService,
    private readonly logger: AppLogger,
  ) {}

  async onModuleInit(): Promise<void> {
    const settings = this.getSettings();

    this.logSettings(settings);
    this.bindEvents();
    await this.connectWithRetryLoop(settings);
  }

  isConnected(): boolean {
    return this.connection.readyState === ConnectionStates.connected;
  }

  getConnection(): Connection {
    return this.connection;
  }

  async onApplicationShutdown(): Promise<void> {
    this.isShuttingDown = true;

    if (this.connection.readyState !== ConnectionStates.disconnected) {
      this.logger.warn(
        '🟠 [Mongo] Closing connection during application shutdown',
        MongoService.name,
      );
      await this.connection.close();
      this.logger.log('🔌 [Mongo] Connection closed', MongoService.name);
    }
  }

  private getSettings(): MongoSettings {
    const nodeEnv = this.configService.getOrThrow<string>('NODE_ENV');
    const environment = nodeEnv === 'production' ? 'prod' : 'dev';
    const mongoUrl = this.configService.getOrThrow<string>('DB_URL');
    const { baseUri, explicitDatabaseName, displayUri } =
      splitMongoUri(mongoUrl);
    const databaseName =
      environment === 'prod'
        ? this.configService.getOrThrow<string>('MONGO_DB_PROD')
        : this.configService.getOrThrow<string>('MONGO_DB_DEV');

    return {
      environment,
      baseUri,
      explicitDatabaseName,
      databaseName,
      target: `${maskMongoUrl(displayUri)}/${databaseName}`,
      connectTimeoutMs:
        this.configService.getOrThrow<number>('MONGO_CONNECT_TIMEOUT_SECONDS') *
        1000,
      maxRetries: Math.max(
        this.configService.getOrThrow<number>('MONGO_MAX_RETRIES'),
        1,
      ),
      retryDelayMs:
        this.configService.getOrThrow<number>('MONGO_RETRY_DELAY_SECONDS') *
        1000,
      cooldownMs:
        this.configService.getOrThrow<number>('MONGO_COOLDOWN_SECONDS') * 1000,
    };
  }

  private logSettings(settings: MongoSettings): void {
    this.logger.log(
      `🧭 [Mongo] Environment: ${settings.environment}`,
      MongoService.name,
    );
    this.logger.log(`🔗 [Mongo] Target: ${settings.target}`, MongoService.name);
    this.logger.log(
      `🗂️ [Mongo] Database: ${settings.databaseName}`,
      MongoService.name,
    );
    this.logger.log(
      `⏱️ [Mongo] Connect timeout: ${settings.connectTimeoutMs / 1000}s`,
      MongoService.name,
    );
    this.logger.log(
      `🔁 [Mongo] Max retries: ${settings.maxRetries}`,
      MongoService.name,
    );
    this.logger.log(
      `⏳ [Mongo] Retry delay: ${settings.retryDelayMs / 1000}s`,
      MongoService.name,
    );
    this.logger.log(
      `🧊 [Mongo] Cooldown after failure cycle: ${settings.cooldownMs / 1000}s`,
      MongoService.name,
    );

    if (
      settings.explicitDatabaseName &&
      settings.explicitDatabaseName !== settings.databaseName
    ) {
      this.logger.warn(
        `⚠️ [Mongo] DB_URL database "${settings.explicitDatabaseName}" will be ignored. Using "${settings.databaseName}" for ${settings.environment}.`,
        MongoService.name,
      );
    }
  }

  private bindEvents(): void {
    if (this.eventsBound) {
      return;
    }

    this.eventsBound = true;

    this.connection.on('connecting', () => {
      this.logger.log('🪝 [Mongo] connecting event fired', MongoService.name);
    });

    this.connection.on('connected', () => {
      this.logger.log('🟢 [Mongo] connected event fired', MongoService.name);
    });

    this.connection.on('open', () => {
      this.logger.log('📂 [Mongo] open event fired', MongoService.name);
    });

    this.connection.on('reconnected', () => {
      this.logger.warn('🔄 [Mongo] reconnecting', MongoService.name);
    });

    this.connection.on('disconnecting', () => {
      this.logger.warn('🟠 [Mongo] disconnecting', MongoService.name);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('🔌 [Mongo] disconnected', MongoService.name);
    });

    this.connection.on('close', () => {
      this.logger.warn('🟠 [Mongo] close event fired', MongoService.name);
    });

    this.connection.on('error', (error: Error) => {
      this.logger.error(
        `🔴 [Mongo] error event: ${error.message}`,
        error.stack,
        MongoService.name,
      );
    });
  }

  private async connectWithRetryLoop(settings: MongoSettings): Promise<void> {
    while (!this.isShuttingDown) {
      for (
        let attempt = 1;
        attempt <= settings.maxRetries && !this.isShuttingDown;
        attempt += 1
      ) {
        try {
          this.logger.log(
            `🟡 [Mongo] Attempt ${attempt}/${settings.maxRetries} -> ${settings.target}`,
            MongoService.name,
          );

          await this.prepareForNextAttempt();
          await this.connection.openUri(settings.baseUri, {
            dbName: settings.databaseName,
            serverSelectionTimeoutMS: settings.connectTimeoutMs,
            connectTimeoutMS: settings.connectTimeoutMs,
          });
          const database = this.connection.db;

          if (!database) {
            throw new Error('Mongo database handle is unavailable');
          }

          await database.admin().ping();

          this.logger.log(
            `✅ [Mongo] Connected -> ${settings.target}`,
            MongoService.name,
          );
          return;
        } catch (error: unknown) {
          const trace = error instanceof Error ? error.stack : undefined;
          const message =
            error instanceof Error ? error.message : 'unknown mongo error';

          this.logger.error(
            `❌ [Mongo] Attempt ${attempt}/${settings.maxRetries} failed -> ${settings.target} | ${message}`,
            trace,
            MongoService.name,
          );

          await this.resetConnection();

          if (attempt < settings.maxRetries) {
            this.logger.warn(
              `⏳ [Mongo] Retrying in ${settings.retryDelayMs / 1000}s`,
              MongoService.name,
            );
            await this.sleep(settings.retryDelayMs);
          }
        }
      }

      if (this.isShuttingDown || this.isConnected()) {
        return;
      }

      this.logger.warn(
        `🧊 [Mongo] All ${settings.maxRetries} attempts failed for ${settings.target}. Cooling down for ${settings.cooldownMs / 1000}s before retrying.`,
        MongoService.name,
      );
      await this.sleep(settings.cooldownMs);
    }
  }

  private async prepareForNextAttempt(): Promise<void> {
    if (this.connection.readyState === ConnectionStates.connected) {
      return;
    }

    if (this.connection.readyState === ConnectionStates.disconnected) {
      return;
    }

    await this.resetConnection();
  }

  private async resetConnection(): Promise<void> {
    if (this.connection.readyState === ConnectionStates.disconnected) {
      return;
    }

    try {
      await this.connection.close();
    } catch {
      // Ignore reset failures between retries; the next openUri call will retry with the same connection instance.
    }
  }

  private async sleep(ms: number): Promise<void> {
    if (ms <= 0 || this.isShuttingDown) {
      return;
    }

    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
