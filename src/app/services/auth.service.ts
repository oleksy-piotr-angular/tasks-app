import { User, SignedUser } from '../models/user';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ResponseMessage, SessionTime, SignInResponse } from '../models/types';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import { SessionToken } from '../models/types';

@Injectable()
export class AuthService {
  private readonly TOKEN_NAME: string = 'user_auth';
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private http: HttpClient, private router: Router) {}

  public signIn(_user: User): Observable<ResponseMessage> {
    return this.signInRequest(_user).pipe(
      map((resp) => {
        this.setSession(resp);
        this.router.navigate(['']);
        return resp;
      })
    );
  }

  public signOut() {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem('expires_at');
    localStorage.removeItem('email');
  }

  get isSignedIn(): Boolean {
    return this.getExpiration()
      ? moment().isBefore(this.getExpiration())
      : false;
  }

  get getAuthToken(): SessionToken | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  get getSessionTime(): SessionTime {
    return this.getExpiration().format('YYYY-MM-DD HH:mm:ss');
  }

  get getEmail(): string | null {
    return localStorage.getItem('email');
  }

  private decodeTokenData(_token: SessionToken): {
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

  private setSession(_response: Pick<SignedUser, 'sessionToken'>) {
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
        //sign out when Session will end for an account
        this.signOut();
        this.router.navigate(['signin']);
      }, expiration * 1000);
      localStorage.setItem(
        'expires_at',
        JSON.stringify(moment().add(expiration, 'second'))
      );
      localStorage.setItem(this.TOKEN_NAME, token);
      localStorage.setItem('email', email);
    }
  }

  private getExpiration(): moment.Moment {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration ? JSON.parse(expiration) : {};
    return moment(expiresAt);
  }

  private signInRequest(_user: User): Observable<SignInResponse> {
    const endpoint = 'user/login';
    return this.http.post<SignInResponse>(this.apiUrl + endpoint, {
      email: _user.email,
      password: _user.password,
    });
  }
}
