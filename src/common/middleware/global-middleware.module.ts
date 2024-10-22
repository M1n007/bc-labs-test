import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AdvancedHttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { AdvancedQueryExceptionFilter } from '../filters/query-exception.filter';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AdvancedHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AdvancedQueryExceptionFilter,
    }
  ],
})
export class GlobalMiddlewareModule {

}
