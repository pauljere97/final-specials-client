import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { LoaderService } from './loader.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      params: request.params.append('token', 'hi-mom')
    });
    this.loaderService.setLoader(true);
    return next.handle(request)
      .pipe(
        catchError((error) => {
          this.loaderService.setLoader(false);
          return throwError(error);
        }),
        tap((data) => {
          if (data.type > 0) {
            this.loaderService.setLoader(false);
          }
          return data;
        })
      )

  }
}
