export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ServiceError';
    // Ensure the prototype is set correctly for instanceof checks to work
    Object.setPrototypeOf(this, ServiceError.prototype);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
      },
    };
  }
}

export type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    total?: number;
    cached?: boolean;
    remaining?: number;
    resetAt?: string;
  };
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
