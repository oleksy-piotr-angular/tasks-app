import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(
    private userService: UserService,
    private builder: FormBuilder,
    private toastr: ToastrService,
    private router: Router
  ) {}
  isLoading: boolean = false;
  loginForm = this.builder.group({
    email: this.builder.nonNullable.control('', Validators.required),
    password: this.builder.nonNullable.control('', Validators.required),
  });

  proceedSignIn() {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.signIn(user);
    }
  }
  async signIn(user: User) {
    await this.userService
      .signIn(user)
      .then((response) => {
        this.userService.setUserData({
          email: user.email,
          sessionToken: response.sessionToken,
        });
      })
      .then(async (response) => {
        if (this.userService.isLoggedIn()) {
          this.toastr.clear();
          this.toastr.success('You have successfully Sign in...');
          console.log('email:');
          console.log(sessionStorage.getItem('email'));
          console.log('token:');
          console.log(sessionStorage.getItem('token'));
          this.router.navigate(['']);
        }
      })
      .catch((e) => {
        this.toastr.clear();
        this.toastr.error(e);
        this.isLoading = false;
      });
  }
}
