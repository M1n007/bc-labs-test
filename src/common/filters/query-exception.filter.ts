import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ConfigService } from '@nestjs/config'; // For environment-specific logic

@Catch(QueryFailedError)
export class AdvancedQueryExceptionFilter implements ExceptionFilter {
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    // Check if we are in production environment
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract PostgreSQL error code from the exception
    const postgresErrorCode = (exception as any).code;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error occurred';
    let userMessage = 'An unexpected database error occurred. Please contact support if the issue persists.';

    // Handle specific PostgreSQL error codes
    switch (postgresErrorCode) {
      case '22P02': // Invalid input syntax (e.g., invalid UUID)
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid UUID format or input syntax error';
        userMessage = 'The data provided is invalid. Please check your input and try again.';
        break;
      case '23505': // Unique constraint violation
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry, unique constraint violated';
        userMessage = 'A duplicate record exists. Please ensure the data is unique.';
        break;
      case '23503': // Foreign key violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Foreign key constraint violation';
        userMessage = 'Referenced data does not exist. Please check your input.';
        break;
      case '23514': // Check constraint violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Check constraint violation';
        userMessage = 'The data does not meet required conditions. Please review your input.';
        break;

      case '42883':
        status = HttpStatus.BAD_REQUEST;
        message = 'Invalid input syntax for type';
        userMessage = 'The data provided is invalid. Please check your input and try again.';
        break;
      default:
        message = 'Unhandled database error';
        userMessage = 'An unknown database error occurred. Please contact support if the issue persists.';
    }

    // Log detailed error information
    this.logErrorDetails(exception, request);

    // Prepare the response data
    const responseData = {
      statusCode: status,
      error: this.isProduction ? 'Internal Server Error' : message,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      user_message: this.isProduction ? userMessage : message,
      debug: !this.isProduction ? this.getDebugInfo(exception, request) : undefined,
    };

    // Send the response
    response.status(status).json(responseData);
  }

  /**
   * Log detailed error information to the console or logging service
   */
  private logErrorDetails(exception: QueryFailedError, request: Request) {
    Logger.error('--------------- Start QueryFailedError -----------------');
    Logger.error('Request URL: ' + request.url);
    Logger.error('Request Method: ' + request.method);
    Logger.error('Exception Stack: ', exception.stack);
    Logger.error('Exception Response: ', exception.message);
    Logger.error('---------------- End QueryFailedError ------------------');
  }

  /**
   * Gather detailed debug information for development purposes
   */
  private getDebugInfo(exception: QueryFailedError, request: Request) {
    return {
      exception_name: exception.name,
      stack: exception.stack,
      headers: request.headers,
      query: request.query,
      params: request.params,
      body: request.body,
      details: exception.message,
    };
  }
}
