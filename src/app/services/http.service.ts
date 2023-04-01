import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { catchError, map, retry } from 'rxjs/operators';
import { Task } from '../models/task';

@Injectable()
export class HttpService {
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient) {}

  //USER requests
  async signInRequest(user: User): Promise<Observable<User>> {
    console.log('SignIn Request.');
    const endpoint = 'user/login';
    return this.http
      .post<User>(this.apiUrl + endpoint, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        retry(1),
        catchError((err) => {
          throw err;
        }),
        map((response) => response)
      );
  }

  async signUpRequest(user: User): Promise<Observable<User>> {
    console.log('SignUp Request.');
    const endpoint = 'user/signup';
    return this.http
      .post<User>(this.apiUrl + endpoint, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        retry(1),
        catchError((err) => {
          throw err;
        }),
        map((response) => response)
      );
  }

  //TASK requests
  getTask(): Observable<Array<Task>> {
    const endpoint = '/tasks/myTask';
    return this.http.get<Array<Task>>(this.apiUrl);
  }
}
