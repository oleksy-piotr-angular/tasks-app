import { User } from '../models/user';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, lastValueFrom, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable()
export class AuthService {
  private readonly TOKEN_NAME = 'user_auth';
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private httpClient: HttpClient
  ) {}

  signInRequest(user: User): Observable<User> {
    const endpoint = 'user/login';
    return this.httpClient
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

  ///////////////////////////////////////////////////////////////////////////
  async signIn(_user: User) {
    this.toastr.info('Please wait...');
    try {
      const responseData$ = await this.http.signInRequest(_user);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw 'Invalid Credentials';
    }
  }

  get getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }
  setUserData(data: User) {
    localStorage.setItem('email', data.email ? data.email : '');
    localStorage.setItem(
      this.TOKEN_NAME,
      data.sessionToken ? data.sessionToken : ''
    );
    console.log('User auth data has been set');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_NAME) != undefined;
  }

  async signUp(_user: User) {
    this.toastr.info('Please wait...');
    try {
      const responseData$ = await this.http.signUpRequest(_user);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw err;
    }
  }
}
