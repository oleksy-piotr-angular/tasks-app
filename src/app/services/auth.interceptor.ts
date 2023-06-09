import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaderResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notification: NotificationService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<HttpHeaderResponse>> {
    const token = this.authService.getAuthToken;
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(request).pipe(
        catchError((err) => {
          console.log('AuthInterceptor Error!');
          if (err instanceof HttpErrorResponse) {
            console.log('AuthInterceptor Error!- HttpErrorResponse');
            if (err.status === 401) {
              console.log('AuthInterceptor Error!-HTTP 401 ERROR');
            }
          }
          this.authService.signOut();
          this.notification.showError(
            'Authorization  Error! Try to Log Out and Sign In again.',
            'ERROR:'
          );
          throw err;
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
