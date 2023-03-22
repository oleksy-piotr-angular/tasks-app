import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  signInRequest(user: User): Observable<User> {
    const path = 'user/login';
    return this.http
      .post<User>(this.apiUrl + path, {
        email: user.email,
        password: user.password,
      })
      .pipe(map((response) => response));
  }
}
