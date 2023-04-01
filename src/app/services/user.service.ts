import { User } from './../models/user';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(private http: HttpService, private toastr: ToastrService) {}
  async signIn(_user: User) {
    console.log('userService-singIn');
    this.toastr.info('Please wait...');
    try {
      const responseData$ = await this.http.signInRequest(_user);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw 'Invalid Credentials';
    }
  }
  getUserToken() {
    return sessionStorage.getItem('token');
  }
  setUserData(data: User) {
    console.log('userService-setUserData');
    sessionStorage.setItem('email', data.email ? data.email : '');
    sessionStorage.setItem('token', data.sessionToken ? data.sessionToken : '');
    console.log('User data has been set');
  }

  isLoggedIn(): boolean {
    console.log('userService-isLoggedIn');
    return sessionStorage.getItem('email') != undefined;
  }

  async signUp(_user: User) {
    console.log('userService-singUp');
    this.toastr.info('Please wait...');
    try {
      const responseData$ = await this.http.signUpRequest(_user);
      return lastValueFrom(responseData$);
    } catch (err) {
      throw err;
    }
  }
}
