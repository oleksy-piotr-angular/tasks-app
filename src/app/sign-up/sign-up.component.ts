import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControlOptions,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { User } from '../models/user';
import { ResponseMessage, ErrorMessage } from '../models/types';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  public isLoading: boolean = false;
  public signUpForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  }>;

  constructor(
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (this.authService.isSignedIn) {
      this.router.navigate(['']);
    }
    this.signUpForm = this.fb.group(
      {
        email: this.fb.nonNullable.control(
          '',
          Validators.compose([
            Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}'),
            Validators.required,
          ])
        ),
        password: this.fb.nonNullable.control(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ])
        ),
        confirmPassword: this.fb.nonNullable.control(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      } as AbstractControlOptions
    );
  }
  get getFormControl(): {
    email: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
  } {
    return this.signUpForm.controls;
  }

  public proceedSignUp(): void {
    this.isLoading = true;
    if (this.signUpForm.valid) {
      const _user: Pick<User, 'email' | 'password'> = {
        email: this.signUpForm.value.email ? this.signUpForm.value.email : '',
        password: this.signUpForm.value.password
          ? this.signUpForm.value.password
          : '',
      };
      this.authService.signUp(_user).subscribe({
        next: (response: ResponseMessage) => {
          this.notification.showSuccess(response.message, 'INFO:');
          this.router.navigate(['signin']);
        },
        error: (err: ErrorMessage) => {
          this.notification.showError(err.error.message, 'ERROR:');
          this.isLoading = false;
          this.router.navigate(['register']);
        },
      });
    }
  }

  private mustMatch(
    password: string,
    confirmPassword: string
  ): (formGroup: FormGroup) => void {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors['mustMatch']
      ) {
        return;
      }
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ mustMatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }
}
