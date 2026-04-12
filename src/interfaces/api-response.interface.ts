export interface ResponseMetadata {
  success: boolean;
  statusCode: number;
  message: string | string[];
  timeStamp: string;
  path: string;
}

export interface SuccessResponse<T> extends ResponseMetadata {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse extends ResponseMetadata {
  success: false;
  error: string;
}
