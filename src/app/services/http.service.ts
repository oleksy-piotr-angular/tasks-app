import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  async signInRequest(user: User): Promise<Observable<User>> {
    console.log('SignIn Request.');
    const path = 'user/login';
    return this.http
      .post<User>(this.apiUrl + path, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        retry(1),
        catchError((err) => {
          throw 'Invalid email or password, Try Again...';
        }),
        map((response) => response)
      );
  }
}
