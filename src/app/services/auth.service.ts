import { User } from '../models/user';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  private readonly TOKEN_NAME = 'user_auth';
  private readonly apiUrl: string = 'https://tasks-api-yg3r.onrender.com/';
  constructor(private toastr: ToastrService, private http: HttpClient) {}

  login(user: User) {
    this.loginRequest(user).subscribe((res) => {
      this.setSession(res);
      console.log(res);
      console.log(this.getExpiration());
      console.log(this.isLoggedIn());
    });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_NAME);
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
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
      const expiresAt = moment().add(expiration, 'second');
      console.log('expiration: ' + expiration);
      console.log('expiresAt' + expiresAt.toString());
      localStorage.setItem('expires_at', JSON.stringify(expiresAt));
      localStorage.setItem(this.TOKEN_NAME, token);
      localStorage.setItem('email', email);
    }
  }

  getExpiration(): moment.Moment {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = expiration ? JSON.parse(expiration) : {};
    return moment(expiresAt);
  }

  get getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_NAME);
  }

  private loginRequest(user: User): Observable<User> {
    const endpoint = 'user/login';
    return this.http.post<User>(this.apiUrl + endpoint, {
      email: user.email,
      password: user.password,
    });
  }
}
