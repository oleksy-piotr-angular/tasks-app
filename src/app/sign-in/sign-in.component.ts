import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { TaskService } from '../services/task.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  isLoading: boolean = false;
  signInForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }>;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private notification: NotificationService,
    private taskService: TaskService
  ) {
    this.signInForm = this.fb.group({
      email: this.fb.nonNullable.control('', Validators.required),
      password: this.fb.nonNullable.control('', Validators.required),
    });
  }

  proceedSignIn() {
    this.isLoading = true;
    this.authService.logout();
    if (this.signInForm.valid) {
      const user: User = {
        email: this.signInForm.value.email,
        password: this.signInForm.value.password,
      };
      this.authService.login(user).subscribe({
        next: (res) => {
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
