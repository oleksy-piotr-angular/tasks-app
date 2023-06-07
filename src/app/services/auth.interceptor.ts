import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAuthToken;
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(request).pipe(
        catchError((err) => {
          console.log('AuthInterceptor Error!');
          if (err instanceof HttpErrorResponse) {
            this.authService.logout();
            this.router.navigate(['']);
            console.log('AuthInterceptor Error!- HttpErrorResponse');
            if (err.status === 401) {
              console.log('AuthInterceptor Error!-HTTP 401 ERROR');
            }
          }
          throw err;
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
