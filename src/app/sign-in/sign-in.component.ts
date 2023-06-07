import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { TaskService } from '../services/task.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notification: NotificationService,
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
      const user: User = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
      this.authService.login(user).subscribe({
        next: (res) => {
          console.log('proceedSignIn: ' + res.message);
          this.taskService.getTasksFromDB();
          this.notification.showSuccess(res.message, 'SUCCESS');
          this.isLoading = false;
        },
        error: (err) => {
          this.notification.showError(err.error.message, 'ERROR:');
          this.isLoading = false;
        },
      });
    }
  }
}
