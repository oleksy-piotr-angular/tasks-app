import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  private readonly TOKEN_NAME = 'user_auth';
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(
    private notification: NotificationService,
    private http: HttpClient,
    private router: Router
  ) {}

  public login(user: User): Observable<{ message: string }> {
    return this.loginRequest(user).pipe(
      map((resp) => {
        console.log('1) Got data from observable: ', resp);
        this.setSession(resp);
        console.log(this.getExpiration());
        console.log(this.isLoggedIn);
        this.router.navigate(['']);
        return resp;
      })
    );
  }

  public logout() {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem('expires_at');
    localStorage.removeItem('email');
  }

  get isLoggedIn(): Boolean {
    return this.getExpiration()
      ? moment().isBefore(this.getExpiration())
      : false;
  }

  get isLoggedOut(): Boolean {
    return !this.isLoggedIn;
  }

  get getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private decodeTokenData(_token: string): {
    email: string;
    iat: number;
    exp: number;
  } {
    const decodedToken: {
      email: string;
      userId: string;
      iat: number;
      exp: number;
    } = jwt_decode(JSON.stringify(_token));
    return {
      email: decodedToken.email,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }

  private setSession(_response: Pick<User, 'sessionToken'>) {
    const token: string | undefined = _response.sessionToken;
    if (token) {
      const decoded: {
        email: string;
        iat: number;
        exp: number;
      } = this.decodeTokenData(token);
      const email: string = this.decodeTokenData(token).email;
      const expiration: number = decoded.exp - decoded.iat;
      setTimeout(() => {
        this.logout();
        this.router.navigate([]);
      }, expiration * 1000);
      const expiresAt = moment().add(expiration, 'second');
      console.log('expiration: ' + expiration);
      console.log('expiresAt' + expiresAt.toString());
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));
      localStorage.setItem(this.TOKEN_NAME, token);
      localStorage.setItem('email', email);
    }
  }

  private getExpiration(): moment.Moment {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration ? JSON.parse(expiration) : {};
    return moment(expiresAt);
  }

  private loginRequest(
    user: User
  ): Observable<{ message: string; sessionToken: string }> {
    const endpoint = 'user/login';
    return this.http.post<{ message: string; sessionToken: string }>(
      this.apiUrl + endpoint,
      {
        email: user.email,
        password: user.password,
      }
    );
  }
}
