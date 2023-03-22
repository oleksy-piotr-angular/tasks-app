import { User } from './../models/user';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { Subject, lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class UserService {
  private user$ = new Subject<User>();

  constructor(private http: HttpService) {}
  async signIn(_user: User) {
    console.log('userService');
    const responseData$ = this.http.signInRequest(_user);
    const response = await lastValueFrom(responseData$);
    this.setUserData({
      sessionToken: response.sessionToken,
      email: _user.email,
    });
  }
  getUserData(): Observable<User> {
    return this.user$.asObservable();
  }
  setUserData(data: User) {
    this.user$.next(data);
  }

  async signUp(_user: User) {}
}
