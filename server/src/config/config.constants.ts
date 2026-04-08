export const configDefaults = {
  app: {
    port: 4000,
    apiPrefix: 'api/v1',
  },
  mongo: {
    connectTimeoutSeconds: 10,
    maxRetries: 5,
    retryDelaySeconds: 3,
    cooldownSeconds: 30,
    devDbName: 'test',
    prodDbName: 'prod',
  },
  cloudinary: {
    defaultResourceType: 'image',
    maxUploadCount: 20,
    uploadBaseUrl: 'https://api.cloudinary.com/v1_1',
    maxRetries: 5,
    retryDelaySeconds: 3,
    cooldownSeconds: 30,
  },
} as const;
