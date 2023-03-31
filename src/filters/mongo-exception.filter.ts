import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';
import { Request, Response } from 'express';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const code = exception.code;

    const exceptions = Object.entries((exception as any).keyValue)[0];

    switch (code) {
      case 11000:
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [`${exceptions[0]} must be unique - ${exceptions[1]}`],
          error: 'Bad Request',
        });
      default:
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: [exception.message],
          error: 'Bad Request',
        });
    }
  }
}
