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
  ) {
    /* this.user.email = 'servertest3@test.pl';
    this.user.password = 'testtest'; */
  }
  loginForm = this.builder.group({
    userName: this.builder.nonNullable.control('', Validators.required),
    password: this.builder.nonNullable.control('', Validators.required),
  });

  proceedLogin() {
    if (this.loginForm.valid) {
      const user = {
        email: this.loginForm.value.userName,
        password: this.loginForm.value.password,
      };
      this.signIn(user);
    }
  }
  signIn(user: User) {
    this.userService.signIn(user);
    this.userService.getUserData().subscribe((data) => {
      console.log(data.email);
      console.log(data.sessionToken);
    });
    /*console.log(this.userService.getUserSessionToken); */
  }
}
