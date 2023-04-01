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
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: UserService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getAuthToken;
    if (token) {
      console.log('AuthInterceptor!');
      console.log(`Bearer ${token}`);
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        console.log('AuthInterceptor Error!');
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['']); //redirect User to Logout|?maybe JWT session time expired?
          }
        }
        throw err;
      })
    );
  }
}
