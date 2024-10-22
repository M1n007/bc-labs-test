export class HttpResponse<T = any> {
  status_code: number;
  message: string;
  data?: T;
  errors?: any;
  metadata?: any;
}
