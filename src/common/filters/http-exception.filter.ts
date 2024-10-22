import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class AdvancedHttpExceptionFilter implements ExceptionFilter {
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    // Determine if we're in production mode
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the HTTP status and response message
    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = exception.getResponse() as Record<string, any>;
    const errorMessage = exception.message || 'Internal Server Error';

    // Log detailed error information
    this.logErrorDetails(exception, request);

    // Prepare the response data
    const responseData = {
      status_code: status,
      error: this.isProduction ? 'Internal Server Error' : errorMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      user_message: this.isProduction
        ? 'An unexpected error occurred. Please contact support if the issue persists.'
        : errorMessage,
      debug: !this.isProduction ? this.getDebugInfo(exception, request, exceptionResponse) : undefined,
    };

    // Send the response
    response.status(status).json(responseData);
  }

  /**
   * Log detailed error information to the console or logging service
   */
  private logErrorDetails(exception: HttpException, request: Request) {
    Logger.error('--------------- Start HttpException -----------------');
    Logger.error('Request URL: ' + request.url);
    Logger.error('Request Method: ' + request.method);
    Logger.error('Exception Stack: ', exception.stack);
    Logger.error('Exception Response: ', exception.getResponse());
    Logger.error('---------------- End HttpException ------------------');
  }

  /**
   * Gather detailed debug information for development purposes
   */
  private getDebugInfo(exception: HttpException, request: Request, exceptionResponse: any) {
    return {
      exception_name: exception.name,
      stack: exception.stack,
      headers: request.headers,
      query: request.query,
      params: request.params,
      body: request.body,
      details: exceptionResponse,
    };
  }
}
