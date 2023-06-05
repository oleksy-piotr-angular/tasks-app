import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private taskService: TaskService
  ) {}
  isLoading: boolean = false;
  loginForm = this.fb.group({
    email: this.fb.nonNullable.control('', Validators.required),
    password: this.fb.nonNullable.control('', Validators.required),
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
    await this.authService
      .signIn(user)
      .then((response) => {
        this.authService.setUserData({
          email: user.email,
          sessionToken: response.sessionToken,
        });
      })
      .then(async (response) => {
        if (this.authService.isLoggedIn()) {
          this.toastr.clear();
          this.toastr.success('You have successfully Sign in...');
          this.taskService.getTasksFromDB();
          this.router.navigate(['']);
        }
        this.isLoading = false;
      })
      .catch((err) => {
        this.toastr.clear();
        const errorMessage = err.error[Object.keys(err.error)[0]]; //extract Error Message
        this.toastr.error(errorMessage);
        this.isLoading = false;
      });
  }
}
